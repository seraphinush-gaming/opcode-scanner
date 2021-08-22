module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (!packet.prev('S_LOAD_TOPO')) return false;

  let prev = packet.prev('S_LOAD_TOPO');
  if (!prev || !prev.parsed) return false;
  let marker = packet.prev('S_SPAWN_ME');
  if (!marker || prev.index > marker.index) return false;

  if (packet.parsed.curHp !== packet.parsed.maxHp) return false;
  if (packet.parsed.unk1 !== 0) return false;
  if (packet.parsed.unk2 !== 0) return false;
  if (packet.parsed.unk3 !== 1) return false;

  for (let i = packet.index - 1; i > marker.index; i--) {
    let pak = packet.history[i];
    if (pak.name() !== 'S_SPAWN_NPC' || !pak.parsed) continue;
    if (packet.parsed.id === pak.parsed.gameId) return true;
  }

  return false;
}