module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (!packet.mapped['S_CHAT']) return false;

  if (packet.parsed.channel >>> 0 >= 300) return false;

  for (let i = packet.index + 1; i < packet.history.length; i++) {
    let next = packet.history[i];
    if (next.name() !== 'S_CHAT') continue;
    if (next.time - packet.time > 1000) continue;
    if (packet.parsed.channel !== next.parsed.channel) continue;
    if (packet.parsed.message !== next.parsed.message) continue;
    return true;
  }

  return false;
}