module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (!packet.prev('S_LOAD_TOPO')) return false;

  let marker = packet.prev('S_SPAWN_ME');
  if (!marker) return false;
  if (packet.parsed.remainingEnrageTime > 3000 * 1000) return false;
  if (packet.parsed.hpLevel > 5) return false;
  if (packet.parsed.status > 4) return false;

  for (let i = packet.history.length - 1; i > marker.index; i--) {
    let prev = packet.history[i];
    if (prev.name() !== 'S_BOSS_GAGE_INFO' || !prev.parsed) continue;
    if (prev.parsed.id === packet.parsed.gameId) return true;
  }

  return false;
}