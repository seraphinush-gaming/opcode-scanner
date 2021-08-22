module.exports = packet => {
  if (packet.index > 200) return;

  let prev = packet.prev('S_GET_USER_GUILD_LOGO');
  if (!prev || !prev.parsed) return false;

  return packet.parsed.id === prev.parsed.playerId;
}