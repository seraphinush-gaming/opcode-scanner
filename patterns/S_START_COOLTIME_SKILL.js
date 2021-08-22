// majorPatchVersion >= 74

module.exports = packet => {
  let prev = packet.prev('S_ACTION_STAGE');
  if (!prev || !prev.parsed || !prev.parsed.skill) return false;

  return prev.parsed.skill.id === packet.parsed.skill.id &&
    packet.parsed.cooldown <= 20000;
}