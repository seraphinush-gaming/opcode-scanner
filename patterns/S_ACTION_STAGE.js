// majorPatchVersion >= 75

module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev || !prev.parsed) return false;

  return prev.parsed.gameId === packet.parsed.gameId &&
    prev.parsed.templateId === packet.parsed.templateId &&
    packet.parsed.speed === packet.parsed.projectileSpeed;
}