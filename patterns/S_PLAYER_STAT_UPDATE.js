// majorPatchVersion >= 106 && majorPatchVersion < 108 : 16
// majorPatchVersion >= 108 : 17
// - Added campfire-related int32

module.exports = packet => {
  let prev = packet.prev('S_SPAWN_ME');
  if (!prev || !prev.parsed) return false;
  if (packet.index > 500) return false;
  if (packet.data.length > 750) return false;
  return packet.time - prev.time < 2000 &&
    packet.parsed.hp > 0n && packet.parsed.hp <= packet.parsed.maxHp &&
    packet.parsed.mp > 0 && packet.parsed.mp <= packet.parsed.maxMp &&
    packet.parsed.maxHp > 0n && packet.parsed.maxHp < 350000n &&
    packet.parsed.maxMp > 0 && packet.parsed.maxMp < 7500 &&
    packet.parsed.runSpeed === 110 &&
    packet.parsed.critPower === 2 &&
    packet.parsed.critPowerPhysical === 2 &&
    packet.parsed.critPowerMagical === 2 &&
    packet.parsed.critPower === 2 &&
    packet.parsed.piercingPhysical === 0 &&
    packet.parsed.piercingMagical === 0 &&
    packet.parsed.level > 0 && packet.parsed.level <= 70 &&
    packet.parsed.level === packet.parsed.trueLevel &&
    packet.parsed.alive &&
    packet.parsed.condition === 120 && 
    packet.parsed.condition === packet.parsed.conditionMax &&
    packet.parsed.stamina <= packet.parsed.staminaMax &&
    packet.parsed.adventureCoins <= packet.parsed.adventureCoinsMax;
}