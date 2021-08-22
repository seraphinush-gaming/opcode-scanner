// Action required
// Action : Resurrect in Highwatch

module.exports = packet => {
  let prev = packet.prev('S_SPAWN_ME')
  if (!prev || !prev.parsed) return false;

  return prev.parsed.gameId === packet.parsed.gameId &&
    packet.parsed.loc.x === 21222 &&
    packet.parsed.loc.y === 5919 &&
    packet.parsed.loc.z === 6216 &&
    packet.parsed.alive &&
    !packet.parsed.inShuttle &&
    !packet.parsed.resItem &&
    !packet.parsed.resPassive;
}