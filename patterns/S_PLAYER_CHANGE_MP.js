module.exports = packet => {
  if (!packet.mapped['S_ACTION_STAGE']) return false;
  if (!packet.prev('S_SPAWN_ME')) return false;

  let next = packet.next('S_ACTION_STAGE');
  if (!next || !next.parsed) return false;

  return next.parsed.gameId === packet.parsed.target &&
    packet.parsed.currentMp <= packet.parsed.maxMp &&
    packet.parsed.maxMp <= 7500 &&
    packet.parsed.diff !== 0 &&
    packet.parsed.type < 5;
}