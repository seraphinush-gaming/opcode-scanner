// majorPatchVersion >= 107

const MAX_INT32 = 2147483647n;
const VANGUARD_VALOR = [99020000, 99020010, 99020020];

module.exports = packet => {
  let prev = packet.prev('S_LOGIN');
  if (!prev || !prev.parsed) return false;

  return packet.parsed.target === prev.parsed.gameId &&
    VANGUARD_VALOR.includes(packet.parsed.id) &&
    packet.parsed.duration === MAX_INT32;
}