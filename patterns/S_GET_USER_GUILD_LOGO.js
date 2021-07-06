module.exports = packet => {
  let next = packet.next();

  return next &&
    next.name() === 'C_SELECT_USER';
}