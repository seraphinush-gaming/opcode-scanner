module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_ACTION_STAGE');
  if (!prev || !prev.parsed) return false;

  return packet.parsed.unk === 0 &&
    packet.parsed.type === 6 &&
    packet.parsed.skill % 1 === 0;
}