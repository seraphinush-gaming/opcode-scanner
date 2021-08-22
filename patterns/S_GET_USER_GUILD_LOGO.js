module.exports = packet => {
  let prev = packet.prev();
  return prev && prev.name() === 'C_GET_USER_GUILD_LOGO' &&
    packet.parsed.playerId === prev.parsed.playerId &&
    packet.parsed.guildId === prev.parsed.guildId;
}