module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (!packet.prev('S_LOAD_TOPO')) return false;

  let marker = packet.prev('S_SPAWN_ME');
  if (!marker || !marker.parsed) return false;
  if (packet.parsed.cid !== marker.parsed.gameId) return false;

  for (let i = packet.history.length - 1; i > marker.index; i--) {
    let prev = packet.history[i];
    if (prev.name() !== 'S_BOSS_GAGE_INFO' || !prev.parsed) continue;
    if (prev.parsed.id === packet.parsed.npc) return true;
  }

  return false;
}