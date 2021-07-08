module.exports = packet => {
  if (!packet.mapped['S_SELECT_USER']) return false;

  let prev = packet.prev('C_SELECT_USER');
  return prev && packet.parsed.playerId === prev.parsed.id &&
    packet.parsed.level === 70;
}