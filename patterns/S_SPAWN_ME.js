module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev) return false;
  if (!packet.prev('S_LOAD_TOPO')) return false;

  return prev.parsed && prev.parsed.gameId === packet.parsed.gameId &&
    packet.parsed.alive &&
    !packet.parsed.isLord;
}