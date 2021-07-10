// majorPatchVersion >= 107

const MAX_INT32 = 2147483647n;
const VANGUARD_VALOR = [99020000, 99020010, 99020020];

module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev) return false;

  return prev.parsed.gameId === packet.parsed.target &&
    VANGUARD_VALOR.includes(packet.parsed.id) &&
    packet.parsed.duration === MAX_INT32;
}