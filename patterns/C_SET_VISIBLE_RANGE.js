module.exports = packet => {
  return packet.index <= 15 &&
    packet.parsed.range >= 1000 &&
    packet.parsed.range <= 2500;
}