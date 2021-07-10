module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (!packet.prev('S_LOAD_TOPO')) return false;

  if (!packet.parsed.friends) return false;
  if (packet.parsed.friends.length === 0) return false;
  for (let friend of packet.parsed.friends) {
    if (friend.level > 70) return false;
    if (friend.race > 5) return false;
    if (friend.class > 12) return false;
    if (friend.gender > 1) return false;
  }

  return true;
}