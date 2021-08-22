const VANGUARD_VALOR = [99020000, 99020010, 99020020];

module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (!packet.mapped['S_ABNORMALITY_BEGIN']) return false;

  if (!VANGUARD_VALOR.includes(packet.parsed.id)) return false;

  for (let i = packet.index - 1; i > 0; i--) {
    let item = packet.history[i];
    if (item.name() !== 'S_ABNORMALITY_BEGIN') continue;
    if (!item.parsed) continue;
    if (packet.parsed.target !== item.parsed.target) continue;
    if (packet.parsed.id !== item.parsed.id) continue;
    return true;
  }

  return false;
}