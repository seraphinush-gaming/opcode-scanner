module.exports = packet => {
  let prev = packet.prev('S_GET_USER_LIST');
  if (!prev || !packet.parsed) return false;

  for (let character of prev.parsed.characters) {
    if (packet.parsed.playerId === character.id && packet.parsed.guildId === character.guildLogoId) {
      return true;
    }
  }

  return false;
}