const Square = require("./square");
const Util = require("./util");

class Game {
  constructor() {
    this.squares = {};
    this.addSquares();
    this.setUpBoard();
    this.addLiveCount();

    this.fill = false;
    // only squares has precedent
    this.onlySquares = true;
    this.followPath = true;
    this.randomColors = false;
    this.rainbowStep = true;
  }

  addSquares() {
    Game.ALLPOSITIONS.forEach((position) => {
      const options = {
        pos: position,
        canvasPosition: Util.canvasPosition(position),
        width: Util.RECTWIDTH,
        height: Util.RECTHEIGHT,
        game: this
      };
      this.squares[position] = new Square(options);

    });
  }

  setUpBoard() {
    if (Game.OBJECTATTACK) {
      this.objectAttack("pulsar");
    }

    if (Game.PLACEOBJECTS) {
      this.placeObjects("gosperGliderGun", 6);
    }

    if (Game.RANDOM) {
      this.placeRandomObjectsRandomly(Game.RANDOMOBJECTSCOUNT);
    }
  }

  placeRandomObjectsRandomly(number) {
    for (let i = 0; i < number; i++) {
      this.placerandomObjectRandomly();
    }
  }

  constantize(string) {
    let constant;
    return eval("this." + string);
  }

  placerandomObjectRandomly() {
    const randomObjectName = Square.OBJECTNAMES[Math.floor(Math.random() * Square.OBJECTNAMES.length)];

    const findDist = this.constantize(`${randomObjectName}Dist`);
    const dist = findDist();
    const randTries = 50;

    for (let i = 0; i < randTries; i++) {
      const randX = Math.floor(Math.random() * (Util.NUMSQUARESX));
      const randY = Math.floor(Math.random() * (Util.NUMSQUARESY));
      if (this.placeObject([randX, randY], randomObjectName)) {
        return null;
      }
    }
  }

  isAllDead(pos, objectDist) {
    let furthestX = pos[0] + objectDist + 1;
    if (furthestX >= Util.NUMSQUARESX) {
      return false;
    }
    let furthestY = pos[1] + objectDist;

    if (objectDist === this.gosperGliderGunDist()) {
      furthestY = 15;
    }

    if (furthestY >= Util.NUMSQUARESY) {
      furthestY = Util.NUMSQUARESY - 1;
    }
    const startingX = pos[0];
    let startingY = pos[1] - objectDist;

    if (objectDist === this.gosperGliderGunDist()) {
      startingY = pos[1] - 15;
    }

    if (startingY < 0) {
      startingY = 1;
    }
    for (let i = startingX; i < furthestX; i++) {
      for (let j = startingY; j < furthestY; j++) {
        if (this.squares[[i, j]].live) {
          return false;
        }
      }
    }
    return true;
  }

  placeObject(startingPos, objectName) {
    const place = this.constantize(objectName);
    const positionList = place(startingPos);
    const findDist = this.constantize(`${objectName}Dist`);
    const distBetween = findDist();

    if (this.isAllDead(startingPos, distBetween)) {
      positionList.forEach((position) => {
        if (position[0] < Util.NUMSQUARESX && position[1] < Util.NUMSQUARESY && position[0] > 0 && position[1] > 0) {
          this.squares[position].live = true;
        }
      });
      return true;
    }
  }

  placeObjects(objectName, count) {
    const findDist = this.constantize(`${objectName}Dist`);
    const distBetween = findDist();

    const shipsCountX = Math.floor(Math.sqrt(count)) + 1;
    const shipsCountY = Math.floor(Math.sqrt(count)) + 1;

    const paddingX = Math.floor(Util.NUMSQUARESX / (shipsCountX + 1));
    const paddingY = Math.floor(Util.NUMSQUARESY / (shipsCountY + 1));

    let placedCount = 0;
    for (let i = 0; i < shipsCountX; i++) {
      for (let j = 0; j < shipsCountY; j++) {
        const xPos = paddingX * (i + 1) - Math.floor(distBetween / 2);
        const yPos = paddingY * (j + 1) - Math.floor(distBetween / 2) + Math.floor(distBetween / 2);
        console.log(`xPos: ${xPos}`);
        console.log(`yPos: ${yPos}`);
        if ((this.placeObject([xPos, yPos], objectName) &&
          ++placedCount === count)) {
            return null;
        }
      }
    }

  }

  objectAttack(objectName) {
    const findDist = this.constantize(`${objectName}Dist`);
    const distBetween = findDist();
    const startingY = 4;
    const startingX = 4;

    const shipsCountX = Math.floor((Util.NUMSQUARESX - distBetween) / distBetween);
    const shipsCountY = Math.floor((Util.NUMSQUARESY - distBetween) / distBetween);
    for (let i = 0; i < shipsCountX; i++) {
      for (let j = 0; j < shipsCountY; j++) {
        this.placeObject([i * distBetween + startingX, (j * distBetween) + distBetween ], objectName);

      }
    }
  }


  addLiveCount() {
    Game.ALLPOSITIONS.forEach((position) => {
      this.squares[position].surroundingLivesCount = this.howManyLive(position);
    });
  }

  surroundingSquares(pos) {
    const surrounds = Util.surroundingPositions(pos).map(squarepos => {
      return this.squares[squarepos];
    });
    return surrounds;
  }

  howManyLive(pos) {
    const squares = this.surroundingSquares(pos);
    const liveCount = squares.reduce((accum, square) => {
      if (square !== undefined && square.live) {
        return accum + 1;
      } else {
        return accum;
      }
    }, 0);
    return liveCount;
  }

  changeSquares() {
    Game.ALLPOSITIONS.forEach((position) => {
      return this.squares[position].change(this.squares[position].surroundingLivesCount);
    });
    this.addLiveCount();
  }

  draw(context) {
    if (!this.onlySquares) {
      if (!this.fill) {
        context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
        context.fillStyle = Game.BG_COLOR;
        context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
      }
    }
    Game.ALLPOSITIONS.forEach((position) => {
      if (this.squares[position].live) {
      }
      this.squares[position].draw(context);
    });
  }

  block(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];
    return [[posX, posY], [posX + 1, posY], [posX, posY + 1], [posX + 1, posY + 1]];
  }
  blockDist() {
    return 4;
  }

  beehive(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY], [posX + 2, posY + 1], [posX + 1, posY + 1]];
  }

  beehiveDist() {
    return 6;
  }

  loaf(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY], [posX + 3, posY + 1], [posX + 2, posY + 2], [posX + 1, posY + 1]];
  }

  loafDist() {
    return 6;
  }

  boat(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX, posY - 1], [posX + 1, posY - 1], [posX + 2, posY], [posX + 1, posY + 1]];
  }

  boatDist() {
    return 5;
  }

  tub(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY], [posX + 1, posY + 1]];
  }

  tubDist() {
    return 5;
  }

  blinker(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY], [posX + 2, posY]];
  }

  blinkerDist() {
    return 5;
  }

  toad(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY - 1], [posX + 2, posY], [posX + 1, posY]];
  }

  toadDist() {
    return 6;
  }

  beacon(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY], [posX, posY + 1], [posX + 1, posY + 1], [posX + 2, posY + 2], [posX + 3, posY + 3], [posX + 2, posY + 3], [posX + 3, posY + 2]];
  }

  beaconDist() {
    return 6;
  }

  clock(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 2, posY], [posX + 2, posY - 1], [posX + 1, posY + 1], [posX + 3, posY + 1], [posX + 1, posY + 2]];
  }

  clockDist() {
    return 6;
  }

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
  }

  pulsarDist() {
    return 18;
  }

  pentadecathlon(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY], [posX + 2, posY - 1], [posX + 2, posY + 1], [posX + 3, posY], [posX + 4, posY],
    [posX + 5, posY], [posX + 6, posY], [posX + 7, posY - 1], [posX + 7, posY + 1], [posX + 8, posY], [posX + 9, posY]];
  }

  pentadecathlonDist() {
    return 20;
  }

  glider(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY], [posX + 2, posY], [posX + 2, posY - 1], [posX + 1, posY - 2]];
  }

  gliderDist() {
    return 6;
  }

  lightWeightSpaceship(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY - 1], [posX + 4, posY - 1], [posX + 4, posY], [posX + 4, posY + 1], [posX + 3, posY + 2], [posX, posY + 2]];
  }

  lightWeightSpaceshipDist() {
    return 8;
  }

  benchmark(startingPos) {
    const posX = startingPos[0];
    const posY = startingPos[1];

    return[
      [posX, posY], [posX + 1, posY], [posX + 2, posY], [posX + 3, posY],
      [posX + 4, posY], [posX + 5, posY], [posX+ 6, posY], [posX + 7, posY],
      [posX + 8, posY], [posX + 9, posY], [posX + 10, posY], [posX + 11, posY],
      [posX + 12, posY],[posX + 13, posY],[posX + 14, posY]];
  }

  benchmarkDist() {
    return 16;
  }

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
  }

  gosperGliderGunDist() {
    return 40;
  }
}

Square.OBJECTNAMES =
  ["block", "beehive", "loaf", "boat", "tub", "blinker", "toad", "beacon",
  "pulsar", "pentadecathlon", "glider", "lightWeightSpaceship", "clock", "benchmark", "gosperGliderGun"];

Square.OBJECTS = {
  block: {dist: 0, positionList: [[0, 0], [1, 0], [0, 1], [1, 1]]},
  beehive: {dist: 0, positionList: [[0, 0], [1, 1], [2, 1], [3, 0], [2, 1], [1, 1]]},
  loaf: {dist: 0, positionList: [[0, 0], [1, 1], [2, 1], [3, 0], [3, 1], [2, 2], [1, 1]]},
  boat: {dist: 0, positionList: [[0, 0], [0, 1], [1, 1], [2, 0], [1, 1]]},
  tub: {dist: 0, positionList: [[0, 0], [1, 1], [2, 0], [1, 1]]},
  blinker: {dist: 0, positionList: [[0, 0], [1, 0], [2, 0]]},
  toad: {dist: 0, positionList: [[0, 0], [1, 1], [2, 1], [3, 1], [2, 0], [1, 0]]},
  beacon: {dist: 0, positionList: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 2], [3, 3], [2, 3], [3, 2]]},
  pulsar: {dist: 0, positionList: [[2, 10], [3, 10], [4, 10], [8, 10], [9, 10], [10, 10],
  [0, 8], [5, 8], [7, 8], [12, 8],
  [0, 7], [5, 7], [7, 7], [12, 7],
  [0, 6], [5, 6], [7, 6], [12, 6],
  [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
  [2, 3], [3, 3], [4, 3], [8, 3], [9, 3], [10, 3],
  [0, 2], [5, 2], [7, 2], [12, 2],
  [0, 1], [5, 1], [7, 1], [12, 1],
  [0, 0], [5, 0], [7, 0], [12, 0],
  [2, 2], [3, 2], [4, 2], [8, 2], [9, 2], [10, 2]]},
  pentadecathlon: {dist: 0, positionList: [[0, 0], [1, 0], [2, 1], [2, 1], [3, 0], [4, 0],
  [5, 0], [6, 0], [7, 1], [7, 1], [8, 0], [9, 0]]},
  glider: {dist: 0, positionList: [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2]]},
  lightWeightSpaceship: {dist: 0, positionList: [[0, 0], [1, 1], [2, 1], [3, 1], [4, 1], [4, 0], [4, 1], [3, 2], [0, 2]]},
  clock: {dist: 0, positionList: [[0, 0], [2, 0], [2, 1], [1, 1], [3, 1], [1, 2]]},
  benchmark: {dist: 0, positionList: [
    [0, 0], [1, 0], [2, 0], [3, 0],
    [4, 0], [5, 0], [0+ 6, 0], [7, 0],
    [8, 0], [9, 0], [1055555555, 0], [11, 0],
    [12, 0],[13, 0],[14, 0]]},
};

Game.DIM_X = Util.CANVASWIDTH;
Game.DIM_Y = Util.CANVASHEIGHT;
Game.BG_COLOR = "#424949";
Game.ALLPOSITIONS = Util.allPositions();

Game.OBJECTATTACK = false;
Game.RANDOM = false;
Game.PLACEOBJECTS = true;
Game.RANDOMOBJECTSCOUNT = 10;



module.exports = Game;
