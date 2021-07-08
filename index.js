'use strict';

const fs = require('fs');
const path = require('path');
const Packet = require('./packet.js');

const FAKE_OPCODE = 65535;

const PASSIVE_SCAN_INTERVAL = 2800;
const PASSIVE_SCAN_TIMEOUT = 100;
const PASSIVE_SCAN_HOLDOFF = 100;

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
        if (!this.mapped[pattern]) this.patterns[pattern] = require('./patterns/' + pattern);
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

    this.passiveScan();

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
    let prefix = packet.fromServer ? 'S_' : 'C_';

    for (let pattern in this.patterns) {
      if (pattern.startsWith(prefix)) {
        packet.parsedName = pattern;

        let code = this.mod.dispatch.protocolMap.name.get(pattern);
        if (!code) this.mod.dispatch.protocolMap.name.set(pattern, FAKE_OPCODE);

        packet.setHistory(this.history);
        packet.setMap(this.map);
        packet.setMapped(this.mapped);
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
          if (packet.parsedLength === packet.data.length) {
            this.mod.log('Potential opcode found : ' + pattern + ' = ' + packet.code);
            console.log(JSON.stringify(packet.parsed, (key, value) => typeof value === 'bigint' ? `${value}` : value, 2));
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
            if (!packet.parsedIndex.has(packet.index)) {
              packet.parsedIndex.add(packet.index);
              this.mod.log('Possible match : ' + pattern + ' = ' + packet.code + ' # length ' + packet.parsedLength + ' (expected ' + packet.data.length + ')');
              console.log(JSON.stringify(packet.parsed, (key, value) => typeof value === 'bigint' ? `${value}` : value, 2));
            }
          }
        }
        else {
          packet.parsed = null;
          packet.parsedName = null;
          packet.parsedLength = 0;
        }
      }
    }
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
    let connected = true;

    while (connected) {
      await this.sleep(PASSIVE_SCAN_INTERVAL);

      // set connected state before scanning so that the final pass will definitely happen after disconnect
      connected = this.mod.connection.state !== 3;

      let sleepTime = Date.now();
      let mapped_S_LOGIN = this.mapped['S_LOGIN'];

      for (let i = mapped_S_LOGIN && this.history.length > 50 ? this.history.length - 50 : 0; i < this.history.length; i++) {
        let packet = this.history[i];

        if (!packet.parsed) {
          if (Date.now() - sleepTime > PASSIVE_SCAN_TIMEOUT && connected) {
            await this.sleep(PASSIVE_SCAN_HOLDOFF);
            sleepTime = Date.now();
          }

          this.scan(packet);
        }
      }
    }
  }

  sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

}

module.exports = { NetworkMod: Scanner };