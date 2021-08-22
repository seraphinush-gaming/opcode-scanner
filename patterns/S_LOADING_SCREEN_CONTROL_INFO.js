module.exports = packet => {
  let prev = packet.prev();
  return prev && prev.name() === 'S_CHECK_VERSION';
}