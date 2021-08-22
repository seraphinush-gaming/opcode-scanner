module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (packet.index > 400) return false;
  
  let prev = packet.first('S_REQUEST_SERVANT_INFO_LIST');
  if (!prev || !prev.parsed) return false;

  return packet.index - prev.index < 10;
}