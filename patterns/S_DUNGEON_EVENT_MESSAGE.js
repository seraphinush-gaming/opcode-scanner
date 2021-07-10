module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  return !packet.parsed.chat &&
    /^@dungeon:/.test(packet.parsed.message);
}