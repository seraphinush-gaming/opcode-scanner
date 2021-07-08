module.exports = packet => {
  let prev = packet.prev();
  return prev && prev.name() === 'S_LOGIN_ARBITER' &&
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\:[0-9]{1,5}/.test(packet.parsed.apiServerAddress);
}