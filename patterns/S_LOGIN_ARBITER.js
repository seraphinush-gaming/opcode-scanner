module.exports = packet => {
  let prev = packet.prev();
  return prev && prev.name() === 'S_REMAIN_PLAY_TIME' &&
    packet.parsed.success;
}