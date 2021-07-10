module.exports = packet => {
  if (!packet.mapped['S_LOGIN']) return false;

  return /^@monsterBehavior:\d+/.test(packet.parsed.message);
}