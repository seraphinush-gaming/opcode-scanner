module.exports = packet => {
  let prev =  packet.prev();
    return prev && prev.name() === 'S_GET_USER_LIST' &&
    packet.data.length > 750 &&
    packet.index < 20;
}