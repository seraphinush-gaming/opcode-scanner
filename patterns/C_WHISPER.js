module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (!packet.mapped['S_WHISPER']) return false;

  if (packet.parsed.targetServer >>> 0 >= 200) return false;

  for (let i = packet.index + 1; i < packet.history.length; i++) {
    let next = packet.history[i];
    if (next.name() !== 'S_WHISPER') continue;
    if (next.time - packet.time > 1000) continue;
    if (packet.parsed.targetServer !== next.parsed.recipientServerId) continue;
    if (packet.parsed.target !== next.parsed.recipient) continue;
    if (packet.parsed.message !== next.parsed.message) continue;
    return true;
  }

  return false;
}