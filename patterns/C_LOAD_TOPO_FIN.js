module.exports = packet => {
  if (!packet.prev('S_LOGIN')) return false;
  if (packet.index > 400) return false;
  
  let prev = packet.first('S_REQUEST_SERVANT_INFO_LIST');
  return prev && packet.index - prev.index < 10;
}