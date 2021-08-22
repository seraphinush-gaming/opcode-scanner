'use strict';

const fs = require('fs');
const path = require('path');
const Packet = require('./packet.js');

const config = require('./config.json');

const FAKE_OPCODE = 65535;
const VERBOSE_LOG = config.VERBOSE_LOG;

let SCAN_TIME = null;
const SCAN_INTERVAL = 3000;
const SCAN_INTERVAL_CORRECTION = 50;
const SCAN_PACKET_LIMIT = 150;

class Scanner {

  constructor(mod) {

    this.mod = mod;

    // init
    this.history = [];
    this.index = 0;
    this.map = {};
    this.mapped = {};
    this.patterns = {};
    this.packetDefList = [...(mod.dispatch.protocol.messages || mod.dispatch.protocol.constructor.defs).keys()];
    this.version = mod.clientInterface.info.protocolVersion;

    this.isScanning = false;

    // load opcodes
    try {
      let lines = fs.readFileSync(path.join(__dirname, 'maps', 'protocol.' + this.version + '.map'), 'utf8').split('\n');

      for (let line of lines) {
        line = line.split(' = ');
        this.map[Number(line[1])] = line[0];
        this.mapped[line[0]] = true;

        this.mod.dispatch.protocolMap.name.set(line[0], Number(line[1]));
      }
    } catch (err) {
      mod.warn(err.message);
    }

    // load heuristics
    try {
      let patterns = fs.readdirSync(path.join(__dirname, 'patterns')).filter(name => name.endsWith('js'));

      for (let pattern of patterns) {
        pattern = pattern.slice(0, pattern.indexOf('.')) || pattern;
        if (!this.packetDefList.includes(pattern)) {
          mod.warn('Missing definition. could not load heuristic : ' + pattern);
          continue;
        }
        if (!this.mapped[pattern]) {
          this.patterns[pattern] = require('./patterns/' + pattern);
          if (VERBOSE_LOG) mod.log('Added heuristic : ' + pattern);
        }
      }

      mod.log('Opcode scanner initialized, loaded ' + Object.keys(this.patterns).length + '/' + patterns.length + ' patterns.');
    } catch (err) {
      mod.warn(err.message);
    }

    // hook
    mod.hook('*', 'raw', { order: -99999999 }, (code, data, fromServer) => {
      let packet = new Packet({
        code,
        data: Buffer.from(data),
        fromServer,
        map: this.map,
        mapped: this.mapped,
        history: this.history,
        index: this.index++,
        parsed: null,
        parsedIndex: new Set(),
        parsedLength: 0,
        parsedName: null,
        time: Date.now()
      });

      if (this.map[code]) {
        packet.parsedName = this.map[code];
        try {
          this.parse(packet);
        } catch (err) {
          this.mod.warn(err.message);
        }
      }

      this.history.push(packet);
    });

    // passive scan
    this.scanInterval = SCAN_INTERVAL;
    this.scanIntervalId = this.mod.setInterval(() => {
      if (Object.keys(this.patterns).length === 0) {
        this.mod.clearInterval(this.scanIntervalId);
        this.mod.log('All opcodes found. heuristic patterns depleted.');
      }

      if (!this.isScanning) {
        if (Date.now() - SCAN_TIME > SCAN_INTERVAL_CORRECTION)
        this.scanInterval -= SCAN_INTERVAL_CORRECTION;
        SCAN_TIME = Date.now();
        this.passiveScan();
      } else {
        this.scanInterval += SCAN_INTERVAL_CORRECTION;
      }
    }, this.scanInterval);

  }

  parse(packet) {
    return new Promise((resolve, reject) => {
      try {
        packet.parsed = this.mod.dispatch.fromRaw(packet.parsedName, '*', packet.data);
        let data = this.mod.dispatch.toRaw(packet.parsedName, '*', packet.parsed);
        packet.parsedLength = data.length;
      }
      catch (err) {
        reject(err);
      }
      resolve();
    })
  }

  async scan(packet) {
    return new Promise(async (resolve) => {
      let prefix = packet.fromServer ? 'S_' : 'C_';

      for (let pattern in this.patterns) {
        if (this.mapped[pattern]) continue;

        if (pattern.startsWith(prefix)) {
          packet.parsedName = pattern;

          let code = this.mod.dispatch.protocolMap.name.get(pattern);
          if (!code) this.mod.dispatch.protocolMap.name.set(pattern, FAKE_OPCODE);

          try {
            await this.parse(packet);
          }
          catch (err) {
            packet.parsed = null;
            packet.parsedName = null;
            packet.parsedLength = 0;
            continue;
          }

          if (this.patterns[pattern](packet)) {
            if (packet.parsedIndex.has(packet.index)) continue;
            packet.parsedIndex.add(packet.index);

            if (packet.parsedLength === packet.data.length) {
              this.mod.log('Potential opcode found : ' + pattern + ' = ' + packet.code);
              if (VERBOSE_LOG) this.logParsed(packet.parsed);
              this.map[packet.code] = pattern;
              this.mapped[pattern] = true;

              for (let item in this.history) {
                if (item.code === packet.code && item.index !== packet.index)
                  this.parse(item);
              }

              this.writeMapFile();
              delete this.patterns[pattern];
              break;
            }
            else {
              this.mod.log('Possible match : ' + pattern + ' = ' + packet.code + ' # length ' + packet.parsedLength + ' (expected ' + packet.data.length + ')');
              if (VERBOSE_LOG) this.logParsed(packet.parsed);
            }
          }
          else {
            packet.parsed = null;
            packet.parsedName = null;
            packet.parsedLength = 0;
          }
        }
      }

      resolve();
    });
  }

  logParsed(message) {
    console.log(JSON.stringify(message, (key, value) => {
      if (typeof value === 'object' && value.type && value.type === 'Buffer' && value.data)
        return value.data = '[...]'
      if (typeof value === 'bigint')
        return value.toString() + 'n';
      return value;
    }, 2));
  }

  writeMapFile() {
    let mapDir = path.join(__dirname, 'maps'),
      res = [];

    for (let code in this.map) {
      res.push(this.map[code] + ' = ' + code);
      res.sort();
    }

    if (!fs.existsSync(mapDir)) {
      fs.mkdirSync(mapDir);
    }

    fs.writeFileSync(path.join(mapDir, 'protocol.' + this.version + '.map'), res.join('\n'));
  }

  // async
  async passiveScan() {
    this.isScanning = true;

    // set connected state before scanning so that the final pass will definitely happen after disconnect
    let connected = this.mod.connection.state !== 3;
    let mapped_S_LOGIN = this.mapped['S_LOGIN'];

    for (let i = (mapped_S_LOGIN && this.history.length > SCAN_PACKET_LIMIT) ? this.history.length - SCAN_PACKET_LIMIT : 0; i < this.history.length; i++) {
      let packet = this.history[i];

      if (!packet.parsed && connected) {
        packet.setMap(this.map);
        packet.setMapped(this.mapped);
        if (this.index - packet.index <= SCAN_PACKET_LIMIT)
          packet.setHistory(this.history);

        await this.scan(packet);
      }
    }

    this.isScanning = false;
  }

  sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

}

module.exports = { NetworkMod: Scanner };