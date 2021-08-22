// majorPatchVersion >= 101

module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_LOAD_TOPO');
  if (!prev || !prev.parsed) return false;

  if (prev.parsed.zone === 3012) { // Training Ground
    return packet.parsed.target === 0n &&
      packet.parsed.maxHp === 1n &&
      packet.parsed.enrageThreshold === 0n &&
      packet.parsed.relation === 10 &&
      packet.parsed.templateId === 6002 &&
      packet.parsed.huntingZoneId === 3012 &&
      packet.parsed.shapeId === 0 &&
      packet.parsed.walkSpeed === 0 &&
      packet.parsed.runSpeed === 0 &&
      packet.parsed.status === 0 &&
      packet.parsed.mode === 0 &&
      packet.parsed.hpLevel === 5 &&
      packet.parsed.visible &&
      packet.parsed.seats && packet.parsed.seats.length === 0 &&
      packet.parsed.parts && packet.parsed.parts.length === 0;
  }
  else {
    return packet.parsed.target === 0n && // Highwatch NPC
      packet.parsed.maxHp === 10000n &&
      packet.parsed.shapeId === 0 &&
      packet.parsed.status === 0 &&
      packet.parsed.mode === 0 &&
      packet.parsed.hpLevel === 5 &&
      packet.parsed.questInfo === 0 &&
      packet.parsed.visible &&
      packet.parsed.villager &&
      packet.parsed.spawnType === 1 &&
      packet.parsed.spawnScript === 0 &&
      packet.parsed.seats && packet.parsed.seats.length === 0 &&
      packet.parsed.parts && packet.parsed.parts.length === 0;
  }
}