const LifeObject = {
  block(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];
    return [[posX, posY], [posX + 1, posY - 1], [posX, posY - 1], [posX + 1, posY]];
  },

  blockDist() {
    return 4;
  },

  beehive(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY], [posX + 2, posY + 1], [posX + 1, posY + 1]];
  },

  beehiveDist() {
    return 6;
  },

  loaf(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY], [posX + 3, posY + 1], [posX + 2, posY + 2], [posX + 1, posY + 1]];
  },

  loafDist() {
    return 5;
  },

  boat(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX, posY - 1], [posX + 1, posY - 1], [posX + 2, posY], [posX + 1, posY + 1]];
  },

  boatDist() {
    return 5;
  },

  tub(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY], [posX + 1, posY + 1]];
  },

  tubDist() {
    return 5;
  },

  blinker(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY], [posX + 2, posY]];
  },

  blinkerDist() {
    return 5;
  },

  toad(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY - 1], [posX + 2, posY], [posX + 1, posY]];
  },

  toadDist() {
    return 6;
  },

  beacon(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX, posY - 1], [posX + 1, posY], [posX + 2, posY + 1], [posX + 3, posY + 2], [posX + 2, posY + 2], [posX + 3, posY + 1]];
  },

  beaconDist() {
    return 6;
  },

  clock(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 2, posY], [posX + 2, posY - 1], [posX + 1, posY + 1], [posX + 3, posY + 1], [posX + 1, posY + 2]];
  },

  clockDist() {
    return 6;
  },

  pulsar(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX + 2, posY - 10], [posX + 3, posY - 10], [posX + 4, posY - 10], [posX + 8, posY - 10], [posX + 9, posY - 10], [posX + 10, posY - 10],
    [posX, posY - 8], [posX + 5, posY - 8], [posX + 7, posY - 8], [posX + 12, posY - 8],
    [posX, posY - 7], [posX + 5, posY - 7], [posX + 7, posY - 7], [posX + 12, posY - 7],
    [posX, posY - 6], [posX + 5, posY - 6], [posX + 7, posY - 6], [posX + 12, posY - 6],
    [posX + 2, posY - 5], [posX + 3, posY - 5], [posX + 4, posY - 5], [posX + 8, posY - 5], [posX + 9, posY - 5], [posX + 10, posY - 5],
    [posX + 2, posY - 3], [posX + 3, posY - 3], [posX + 4, posY - 3], [posX + 8, posY - 3], [posX + 9, posY - 3], [posX + 10, posY - 3],
    [posX, posY - 2], [posX + 5, posY - 2], [posX + 7, posY - 2], [posX + 12, posY - 2],
    [posX, posY - 1], [posX + 5, posY - 1], [posX + 7, posY - 1], [posX + 12, posY - 1],
    [posX, posY], [posX + 5, posY], [posX + 7, posY], [posX + 12, posY],
    [posX + 2, posY + 2], [posX + 3, posY + 2], [posX + 4, posY + 2], [posX + 8, posY + 2], [posX + 9, posY + 2], [posX + 10, posY + 2]];
  },

  pulsarDist() {
    return 12;
  },

  pentadecathlon(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY], [posX + 2, posY - 1], [posX + 2, posY + 1], [posX + 3, posY], [posX + 4, posY],
    [posX + 5, posY], [posX + 6, posY], [posX + 7, posY - 1], [posX + 7, posY + 1], [posX + 8, posY], [posX + 9, posY]];
  },

  pentadecathlonDist() {
    return 20;
  },

  glider(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY], [posX + 2, posY], [posX + 2, posY - 1], [posX + 1, posY - 2]];
  },

  gliderDist() {
    return 6;
  },

  lightWeightSpaceship(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1] + 2;

    return [[posX, posY], [posX + 1, posY - 3], [posX + 2, posY - 3], [posX + 3, posY - 3], [posX + 4, posY - 3], [posX + 4, posY - 2], [posX + 4, posY - 1], [posX + 3, posY], [posX, posY - 2]];
  },

  lightWeightSpaceshipDist() {
    return 8;
  },

  benchmark(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return[
      [posX, posY], [posX + 1, posY], [posX + 2, posY], [posX + 3, posY],
      [posX + 4, posY], [posX + 5, posY], [posX+ 6, posY], [posX + 7, posY],
      [posX + 8, posY], [posX + 9, posY], [posX + 10, posY], [posX + 11, posY],
      [posX + 12, posY],[posX + 13, posY],[posX + 14, posY]];
  },

  benchmarkDist() {
    return 16;
  },

  gosperGliderGun(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return[
      [posX, posY], [posX, posY - 1], [posX + 1, posY], [posX + 1, posY - 1],

      [posX + 10, posY], [posX + 10, posY + 1], [posX + 10, posY - 1],
      [posX + 11, posY + 2], [posX + 12, posY + 3], [posX + 13, posY + 3], [posX + 15, posY + 2],
      [posX + 16, posY + 1], [posX + 16, posY], [posX + 16, posY - 1],
      [posX + 17, posY], [posX + 14, posY], [posX + 11, posY - 2], [posX + 12, posY - 3],
      [posX + 13, posY - 3], [posX + 15, posY - 2],

      [posX + 20, posY - 1], [posX + 20, posY - 2], [posX + 20, posY - 3],
      [posX + 21, posY - 3], [posX + 21, posY - 2], [posX + 21, posY - 1], [posX + 22, posY],
      [posX + 24, posY], [posX + 24, posY + 1], [posX + 22, posY - 4], [posX + 24, posY - 4], [posX + 24, posY - 5],

      [posX + 34, posY - 2], [posX + 34, posY - 3], [posX + 35, posY - 2], [posX + 35, posY - 3]];
  },

  gosperGliderGunDist() {
    return 40;
  }
};

module.exports = LifeObject;
