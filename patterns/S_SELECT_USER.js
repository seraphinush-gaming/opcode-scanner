module.exports = packet => {
  if (packet.index > 200) return;

  let prev = packet.prev('C_SELECT_USER');
  return prev && packet.index - prev.index < 5;
}