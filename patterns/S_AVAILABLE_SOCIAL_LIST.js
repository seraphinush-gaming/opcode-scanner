module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (packet.prev('S_LOAD_TOPO')) return false;
  if (packet.index > 100) return false;

  let prev = packet.prev();
  return prev && prev.name() === 'S_SKILL_CATEGORY';
}