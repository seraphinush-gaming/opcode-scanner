module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev) return false;

  return prev.parsed.gameId === packet.parsed.gameId;
}