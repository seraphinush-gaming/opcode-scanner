module.exports = packet => {
  let prev = packet.prev('S_GET_USER_GUILD_LOGO');
  return prev && prev.parsed.playerId === packet.parsed.id;
}