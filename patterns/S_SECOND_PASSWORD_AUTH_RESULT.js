module.exports = packet => {
  let prev = packet.prev();
  return prev &&  prev.name() === 'C_SECOND_PASSWORD_AUTH';
}