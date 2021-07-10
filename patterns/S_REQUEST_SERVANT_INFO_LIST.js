module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (!packet.prev('S_LOAD_TOPO')) return false;

  if (!packet.parsed.hidden) return false;
  if (packet.parsed.slots < 10 || packet.parsed.slots > 50) return false;
  if (!packet.parsed.servants) return false;
  if (packet.parsed.servants.length === 0) return false;
  for (let servant of packet.parsed.servants) {
    if (servant.type > 1) return false;
    if (servant.type === 0) { // pet
      if (servant.level > 10) return false;
      if (servant.energy > servant.energyMax) return false;
      if (servant.energyMax !== 100) return false;
      if (servant.fellowship !== 1) return false;
      if (servant.slot > packet.parsed.slots) return false;
    }
    else if (servant.type === 0) { // partner
      if (servant.level > 10) return false;
      if (servant.energy > servant.energyMax) return false;
      if (servant.energyMax !== 300) return false;
      if (servant.fellowship > 50) return false;
      if (servant.slot > packet.parsed.slots) return false;
    }
  }

  return true;
}