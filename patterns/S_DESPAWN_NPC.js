module.exports = packet => {
  if (!packet.mapped['S_SPAWN_NPC']) return false;
  let prev = packet.prev('S_LOAD_TOPO');
  if (!prev || !prev.parsed) return false;


  for (let i = packet.index - 1; i > prev.index; i--) {
    let pak = packet.history[i];
    if (pak.name() === 'S_SPAWN_NPC') {
      if (!pak.parsed) continue;
      if (pak.parsed.gameId === packet.parsed.gameId &&
        pak.parsed.loc.dist3D(packet.parsed.loc) < 100 &&
        (packet.parsed.type === 1 || packet.parsed.type === 5) &&
        packet.parsed.unk === 0)
        return true;
    }
  }

  return false;
}