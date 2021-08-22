module.exports = packet => {
  if (!packet.mapped['S_ACTION_STAGE']) return false;
  if (!packet.prev('S_SPAWN_ME')) return false;

  let prev = packet.prev('S_ACTION_STAGE');
  if (!prev || !prev.parsed) return false;
  return prev.parsed.gameId === packet.parsed.gameId &&
    prev.parsed.skill.id === packet.parsed.skill.id &&
    prev.parsed.id === packet.parsed.id;
}