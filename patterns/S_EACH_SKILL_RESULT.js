// majorPatchVersion >= 86

module.exports = packet => {
  let marker = packet.prev('S_SPAWN_ME');
  if (!marker || !marker.parsed) return false;
  if (!packet.prev('S_ACTION_END')) return false;
  if (packet.parsed.value <= 0n) return false;

  for (let i = packet.index; i > marker.index; i--) {
    let pak = packet.history[i];
    if (pak.name() !== 'S_ACTION_STAGE') continue;
    if (!pak.parsed || packet.index - pak.index > 20) continue;
    if ((packet.parsed.owner !== 0n ? packet.parsed.owner : packet.parsed.source) === pak.parsed.gameId &&
      packet.parsed.skill.id === pak.parsed.skill.id &&
      packet.parsed.damageType < 3)
      return true;
  }

  return false;
}