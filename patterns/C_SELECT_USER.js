module.exports = packet => {
  if (packet.index > 200) return;
  let prev = packet.prev('S_GET_USER_GUILD_LOGO');
  return prev && prev.parsed.playerId === packet.parsed.id;
}