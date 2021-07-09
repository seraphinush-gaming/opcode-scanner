module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_INVEN_USERDATA');
  return prev && prev.parsed.gameId === packet.parsed.gameId &&
    packet.parsed.size >= 40;
}