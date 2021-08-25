module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev || !prev) return false;

  return packet.parsed.gameId === prev.parsed.gameId &&
    packet.parsed.senderServerId < 200 &&
    packet.parsed.recipientServerId < 200 &&
    packet.parsed.gm === false &&
    packet.parsed.name === prev.parsed.name &&
    packet.parsed.message.startsWith('<FONT');
}