module.exports = packet => {
  let prev = packet.prev('S_LOADING_SCREEN_CONTROL_INFO');
  return prev && packet.index - prev.index < 5;
}