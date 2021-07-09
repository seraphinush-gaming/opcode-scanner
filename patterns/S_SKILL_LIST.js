module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (packet.index > 100) return false;

  return packet.parsed.skills && packet.parsed.skills.length > 20;
}