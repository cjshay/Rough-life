const Util = {
  // rectangleCanvasPositions() {
  //   const rectWidth = Util.RECTWIDTH;
  //   const rectHeight = Util.RECTHEIGHT;
  //   const rectPositions = [];
  //   for (let i = 0; i < Util.NUMSQUARES; i++) {
  //     rectPositions.push([rectWidth * i, rectHeight * i]);
  //   }
  //   return rectPositions;
  // },
  canvasPosition(position) {
    return [Util.RECTWIDTH * position[0], Util.RECTHEIGHT * position[1]];
  },
  surroundingPositions(pos) {
    return [
      [1 + pos[0], 1 + pos[1]],
      [pos[0], 1 + pos[1]],
      [-1 + pos[0], 1 + pos[1]],
      [1 + pos[0], pos[1]],
      [1 + pos[0], -1 + pos[1]],
      [pos[0], -1 + pos[1]],
      [-1 + pos[0], pos[1]],
      [-1 + pos[0], -1 + pos[1]],
    ];
  },
  allPositions() {
    const positions = [];
    for (let i = 0; i < Util.NUMSQUARESX; i++) {
      for (let j = 0; j < Util.NUMSQUARESY; j++) {
        positions.push([i, j]);
      }
    }
    return positions;
  },
  numSquaresX() {
    return Util.NUMSQUARESX;
  },
  numSquaresY() {
    return Util.NUMSQUARESY;
  },
  rectSize() {
    return Util.RECTHEIGHT;
  }
};

Util.CANVASWIDTHMULTIPLIER = 1;
Util.CANVASHEIGHTMULTIPLIER = 1;
Util.CANVASWIDTH = 1000 * Util.CANVASWIDTHMULTIPLIER;
Util.CANVASHEIGHT = 600 * Util.CANVASHEIGHTMULTIPLIER;
Util.SQUAREMULTIPLIER = 1;
Util.NUMSQUARESX = 120 * Util.SQUAREMULTIPLIER;
Util.NUMSQUARESY = 80 * Util.SQUAREMULTIPLIER;
Util.RECTWIDTH = Util.CANVASHEIGHT / Util.NUMSQUARESY;
Util.RECTHEIGHT = Util.CANVASHEIGHT / Util.NUMSQUARESY;

module.exports = Util;
