module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev || !prev) return false;

  return packet.parsed.channel >>> 0 < 300 &&
    packet.parsed.gameId === prev.parsed.gameId &&
    packet.parsed.name === prev.parsed.name &&
    packet.parsed.message.startsWith('<FONT');
}