module.exports = packet => {
  let marker = packet.prev('S_SPAWN_ME');
  if (!marker || !marker.parsed) return false;
  if (!packet.prev('S_ACTION_STAGE')) return false;

  let next = packet.next('S_EACH_SKILL_RESULT');
  if (!next || !next.parsed) return false;
  if (packet.parsed.curHp > packet.parsed.maxHp) return false;
  if (packet.parsed.diff === 0n) return false;

  return packet.parsed.source === next.parsed.source &&
    packet.parsed.diff + next.parsed.value === 0n &&
    packet.parsed.crit < 2;
}