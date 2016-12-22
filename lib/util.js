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
    for (let i = 0; i < Util.NUMSQUARES; i++) {
      for (let j = 0; j < Util.NUMSQUARES; j++) {
        positions.push([i, j]);
      }
    }
    return positions;
  }
};

Util.CANVASWIDTH = 1000;
Util.CANVASHEIGHT = 600;
Util.NUMSQUARES = 100;
Util.RECTWIDTH = Util.CANVASWIDTH / Util.NUMSQUARES;
Util.RECTHEIGHT = Util.CANVASHEIGHT / Util.NUMSQUARES;
Util.LESSSQUARES = 1;

module.exports = Util;
