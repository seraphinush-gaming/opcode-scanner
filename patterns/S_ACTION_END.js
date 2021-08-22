module.exports = packet => {
  if (!packet.prev('S_SPAWN_ME')) return false;
  if (!packet.mapped['S_ACTION_STAGE']) return false;

  let prev = packet.prev('S_ACTION_STAGE');
  if (!prev || !prev.parsed) return false;

  return packet.parsed.gameId === prev.parsed.gameId &&
    packet.parsed.skill.id === prev.parsed.skill.id &&
    packet.parsed.id === prev.parsed.id;
}