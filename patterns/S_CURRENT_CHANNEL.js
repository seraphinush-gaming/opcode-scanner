module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_LOAD_TOPO');
  if (!prev || !prev.parsed) return false;

  return packet.parsed.zone === prev.parsed.zone &&
    packet.parsed.density < 3 &&
    packet.parsed.type !== 0 &&
    packet.parsed.type < 4;
}