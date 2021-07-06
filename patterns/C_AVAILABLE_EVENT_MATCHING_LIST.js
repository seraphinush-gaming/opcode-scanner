module.exports = packet => {
  let next = packet.next('S_AVAILABLE_EVENT_MATCHING_LIST');

  return next &&
    next.index - packet.index < 5;
}