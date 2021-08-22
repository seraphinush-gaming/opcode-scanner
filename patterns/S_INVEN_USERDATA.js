module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev || !prev.parsed) return false;

  return packet.parsed.gameId === prev.parsed.gameId;
}