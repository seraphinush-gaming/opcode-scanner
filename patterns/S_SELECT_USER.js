module.exports = packet => {
  let prev = packet.prev('C_SELECT_USER');
  return prev && packet.index - prev.index < 5;
}