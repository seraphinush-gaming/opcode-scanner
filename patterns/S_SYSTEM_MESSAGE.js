module.exports = packet => {
  if (packet.mapped['S_LOGIN']) return false;

  return /^@\d+/.test(packet.parsed.message);
}