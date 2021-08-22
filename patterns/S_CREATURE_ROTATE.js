module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (!packet.prev('S_LOAD_TOPO')) return false;

  let marker = packet.prev('S_SPAWN_ME');
  if (!marker) return false;
  if (packet.parsed.w < -3.15 || packet.parsed.w > 3.15) return false;
  if (packet.parsed.time === 0 || packet.parsed.time > 4000) return false;

  for (let i = packet.history.length - 1; i > 20; i--) {
    let prev = packet.history[i];
    if (!prev.parsed || prev.name() !== 'S_BOSS_GAGE_INFO') continue;
    if (packet.parsed.gameId === prev.parsed.id) return true;
  }

  return false;
}