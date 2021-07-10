module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_GET_USER_GUILD_LOGO');
  return prev.parsed.guildId === packet.parsed.guildId &&
    packet.parsed.guildLevel >= 0 &&
    packet.parsed.guildLevel < 400 &&
    packet.parsed.guildXp >= 0 &&
    packet.parsed.guildXpForLevel >= 0 &&
    packet.parsed.guildFunds > 0 &&
    packet.parsed.characters >= 2 &&
    packet.parsed.accounts >= 1 &&
    packet.parsed.size < 3 &&
    packet.parsed.members &&
    packet.parsed.members.length <= 29;
}