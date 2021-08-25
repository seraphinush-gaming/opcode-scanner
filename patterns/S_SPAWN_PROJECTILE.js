module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_ACTION_STAGE');
  if (!prev || !prev.parsed) return false;

  return packet.time - prev.time < 1000 &&
    packet.parsed.gameId === prev.parsed.gameId &&
    Math.floor(packet.parsed.skill.id / 10000) === Math.floor(prev.parsed.skill.id / 10000) &&
    packet.parsed.loc.dist3D(packet.parsed.dest) < 1100;
}