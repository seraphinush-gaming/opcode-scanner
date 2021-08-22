module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_INVEN_USERDATA');
  if (!prev || !prev.parsed) return false;

  return packet.parsed.gameId === prev.parsed.gameId &&
    packet.parsed.size >= 40;
}