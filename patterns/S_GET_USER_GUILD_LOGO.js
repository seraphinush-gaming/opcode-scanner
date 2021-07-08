module.exports = packet => {
  let prev = packet.prev();
  return prev && prev.name() === 'C_GET_USER_GUILD_LOGO' &&
    prev.parsed.playerId === packet.parsed.playerId &&
    prev.parsed.guildId === packet.parsed.guildId;
}