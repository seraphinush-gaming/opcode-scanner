module.exports = packet => {
	let prev = packet.prev();
	return prev && prev.name() === 'S_SELECT_USER';
}