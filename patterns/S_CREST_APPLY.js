module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;

  let prev = packet.prev('S_CREST_INFO');
  if (!prev || !prev.parsed) return false;

  for (let i = 0; i < prev.parsed.crests.length; i++) {
    let crest = prev.parsed.crests[i];
    if (packet.parsed.id === crest.id && packet.parsed.enable !== crest.enable) return true;
  }

  return false;
}