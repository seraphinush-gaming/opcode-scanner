module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  return packet.parsed.points >>> 0 >= 10 &&
    packet.parsed.points <= 65 &&
    packet.parsed.pointsActive <= packet.parsed.points &&
    packet.parsed.crests.length < 90;
}