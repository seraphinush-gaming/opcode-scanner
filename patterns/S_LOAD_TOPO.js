module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  return packet.index < 250 && !packet.parsed.quick;
}