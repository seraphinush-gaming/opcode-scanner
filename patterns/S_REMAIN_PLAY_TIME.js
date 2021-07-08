module.exports = packet => {
  let prev = packet.prev();
  return prev && prev.name() === 'S_SECOND_PASSWORD_AUTH_RESULT';

  // pak.parsed.unk.equals(6);
}