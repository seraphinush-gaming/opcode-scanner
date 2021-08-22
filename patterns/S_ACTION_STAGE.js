// majorPatchVersion >= 75

module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev || !prev.parsed) return false;

  return packet.parsed.gameId === prev.parsed.gameId &&
    packet.parsed.templateId === prev.parsed.templateId &&
    packet.parsed.speed === packet.parsed.projectileSpeed;
}