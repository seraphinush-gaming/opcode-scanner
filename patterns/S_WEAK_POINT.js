module.exports = packet => {
  let marker = packet.prev('S_SPAWN_ME');
  if (!marker || !marker.parsed) return false;
  if (packet.index > 1000) return false;

  return packet.time - marker.time < 2000 &&
    marker.parsed.gameId === packet.parsed.target &&
    packet.parsed.runemarksRemoved === 0 &&
    packet.parsed.runemarksAdded === 0 &&
    packet.parsed.type === 0 &&
    packet.parsed.skill === 0 &&
    packet.prev().code === packet.code;
}