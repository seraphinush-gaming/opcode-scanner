module.exports = packet => {
  let prev = packet.prev('S_GET_USER_LIST');
  if (!prev || !prev.parsed) return false;

  for (let character of prev.parsed.characters) {
    if (packet.parsed.playerId !== character.id) continue;
    if (packet.parsed.guildId !== character.guildLogoId) continue;
    return true;
  }

  return false;
}