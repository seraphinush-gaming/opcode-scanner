class Packet {

  constructor(packet) {
    Object.assign(this, packet);
  }

  first(name) {
    if (!this.mapped[name]) {
      return null;
    }

    for (let packet of this.history) {
      if (packet.name() === name) {
        return packet;
      }
    }

    return null;
  }

  prev(name) {
    if (!name) {
      return this.history[this.index - 1];
    }

    if (!this.mapped[name]) {
      return null;
    }

    for (let i = this.index - 1; i >= 0; i--) {
      let packet = this.history[i];

      if (packet.name() === name) {
        return packet;
      }
    }
    
    return null;
  }

  next(name) {
    if (!name) {
      return this.history[this.index + 1];
    }

    if (!this.mapped[name]) {
      return null;
    }

    for (let i = this.index + 1; i < this.history.length; i++) {
      let packet = this.history[i];

      if (packet.name() === name) {
        return packet;
      }
    }
    
    return null;
  }

  name() {
    return this.map[this.code];
  }

  setHistory(history) { this.history = history; }

  setMap(map) { this.map = map; }

  setMapped(mapped) { this.mapped = mapped; }
}

module.exports = Packet;