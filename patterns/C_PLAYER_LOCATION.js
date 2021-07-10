module.exports = packet => {
  if (!packet.mapped['S_LOGIN']) return false;

  //let prev = packet.prev('S_SPAWN_ME');
  return packet.parsed.loc.dist3D(packet.parsed.dest) < 100 &&
    packet.parsed.type <= 10 &&
    packet.parsed.jumpDistance === 0 &&
    !packet.parsed.inShuttle;
}