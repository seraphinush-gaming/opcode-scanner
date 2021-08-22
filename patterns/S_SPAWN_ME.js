module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev || !prev.parsed) return false;
  if (!packet.prev('S_LOAD_TOPO')) return false;

  return prev.parsed.gameId === packet.parsed.gameId &&
    packet.parsed.alive &&
    !packet.parsed.isLord;
}