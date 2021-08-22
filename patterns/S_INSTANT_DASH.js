module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_ACTION_STAGE');
  if (!prev || !prev.parsed) return false;

  return packet.time - prev.time < 250 &&
    packet.parsed.gameId === prev.parsed.gameId &&
    packet.parsed.unk === 0 &&
    packet.parsed.loc.dist3D(prev.parsed.loc) < 500;
}