module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_LOAD_TOPO');
  return prev && prev.parsed &&
    prev.parsed.zone === packet.parsed.zone &&
    packet.parsed.density < 3 &&
    packet.parsed.type !== 0 &&
    packet.parsed.type < 4;
}