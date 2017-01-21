
const Square = require("./square");
const Util = require("./util");

class Game {
  constructor(context, canvas) {
    this.check = false;
    this.context = context;
    this.canvas = canvas;
    this.color = "red";
    this.percentLiving = 10;
    this.fill = false;
    this.onlySquares = true;
    this.followPath = false;
    this.randomColors = false;
    this.rainbowStep = false;
    this.bindButtons();
    this.random = true;
    // only squares has precedent
    this.step = false;
    this.squares = {};
    this.addSquares();
    this.addLiveCount();

  }



  addSquares() {
    Game.ALLPOSITIONS.forEach((position) => {
      const options = {
        pos: position,
        canvasPosition: Util.canvasPosition(position, Game.RECTWIDTH, Game.RECTHEIGHT),
        width: Game.RECTWIDTH,
        height: Game.RECTHEIGHT,
        game: this
      };
      this.squares[position] = new Square(options);

    });
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
    const randomObjectName = Game.OBJECTNAMES[Math.floor(Math.random() * Game.OBJECTNAMES.length)];

    const findDist = this.constantize(`${randomObjectName}Dist`);
    const dist = findDist();
    const randTries = 50;

    for (let i = 0; i < randTries; i++) {
      const randX = Math.floor(Math.random() * (Game.NUMSQUARESX));
      const randY = Math.floor(Math.random() * (Game.NUMSQUARESY));
      if (this.placeObject([randX, randY], randomObjectName)) {
        return null;
      }
    }
  }

  isAllDead(pos, objectDist) {
    const startingX = pos[0];
    let startingY = pos[1] - objectDist;
    const furthestX = pos[0] + objectDist;
    let furthestY = startingY + objectDist;

    if (objectDist === this.gosperGliderGunDist()) {
      startingY = pos[1] - 12;
      furthestY = pos[1] + 12;
    }
    for (let i = startingX; i < furthestX; i++) {
      for (let j = startingY; j < furthestY; j++) {
        if (this.squares[[i, j]] && this.squares[[i,j]].live) {
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
        if (position[0] < Util.NUMSQUARESX && position[1] < Game.NUMSQUARESY && position[0] > 0 && position[1] > 0) {
          this.squares[position].live = true;
        }
      });

      return true;
    }
  }

  placeObjects(objectName, count) {
    let objCount = count;
    if (objectName === "gosperGliderGun" && count >= 8) {
      objCount = 10;
    }
    const findDist = this.constantize(`${objectName}Dist`);
    const distBetween = findDist();

    let offset = 0;

    const shipsCountX = Math.floor(Math.sqrt(objCount));
    const shipsCountY = Math.floor(Math.sqrt(objCount)) + 1;

    const paddingX = Math.floor(Game.NUMSQUARESX / (shipsCountX + 1));
    const paddingY = Math.floor(Game.NUMSQUARESY / (shipsCountY + 1));

    let placedCount = 0;
    for (let i = 0; i < shipsCountX; i++) {
      for (let j = 0; j < shipsCountY; j++) {
        if (i !== 0 && paddingX < distBetween) {
          offset = distBetween - paddingX;
        }
        const xPos = 5 + paddingX * (i + 1) - Math.floor(distBetween / 2) + offset;
        const yPos = paddingY * (j + 1) - Math.floor(distBetween / 2) + Math.floor(distBetween / 2);
        if ((this.placeObject([xPos, yPos], objectName) &&
          ++placedCount === objCount)) {
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

    const shipsCountX = Math.floor((Game.NUMSQUARESX - distBetween) / distBetween);
    const shipsCountY = Math.floor((Game.NUMSQUARESY - distBetween) / distBetween);
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
    this.addLiveCount();
    Game.ALLPOSITIONS.forEach((position) => {
      return this.squares[position].change(this.squares[position].surroundingLivesCount);
    });
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
    return [[posX, posY], [posX + 1, posY - 1], [posX, posY - 1], [posX + 1, posY]];
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
    return 5;
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

    return [[posX, posY], [posX + 1, posY - 1], [posX, posY - 1], [posX + 1, posY], [posX + 2, posY + 1], [posX + 3, posY + 2], [posX + 2, posY + 2], [posX + 3, posY + 1]];
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
    return 12;
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
    const posY = startingPos[1] + 2;

    return [[posX, posY], [posX + 1, posY - 3], [posX + 2, posY - 3], [posX + 3, posY - 3], [posX + 4, posY - 3], [posX + 4, posY - 2], [posX + 4, posY - 1], [posX + 3, posY], [posX, posY - 2]];
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
// 
  bindButtons() {
    this.squareClick();
    this.stepOnOffButton();
    this.stepButton();
    this.displayButton();
    this.changeColorButton();
    this.startButton();
    this.objectNameButton();
    this.countButton();
    // this.changeCanvasButton();
    // this.changeSquareSizeButton();
  }

  // changeCanvasButton() {
  //   const range = document.getElementById("range-input");
  //   range.value = "100";
  //   range.addEventListener("change", this.changeCanvas.bind(this));
  // }

  // changeCanvas(e) {
  //   this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //   const change = parseInt(e.currentTarget.value) / 100;
  //   Game.CANVASWIDTH = Util.CANVASWIDTH * change;
  //   Game.CANVASHEIGHT = Util.CANVASHEIGHT * change;
  //   Game.RECTHEIGHT = Game.CANVASHEIGHT / Util.NUMSQUARESY;
  //   Game.RECTWIDTH = Game.CANVASHEIGHT / Util.NUMSQUARESY;
  //   if (this.random) {
  //     this.start();
  //   } else {
  //     this.objectPlaceClick();
  //   }
  //
  //   this.squares = {};
  //   this.addSquares();
  //   this.addLiveCount();
  // }

  // changeSquareSizeButton() {
  //   const squareSize = document.getElementById("square-size");
  //   squareSize.value = "0";
  //   squareSize.addEventListener("change", this.changeSquareSize.bind(this));
  // }
  //
  // changeSquareSize(e) {
  //   this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //   const change = parseInt(e.currentTarget.value) / 100;
  //   Game.NUMSQUARESY = Math.round(Util.NUMSQUARESY * change);
  //   Game.NUMSQUARESX = Math.round(Util.NUMSQUARESX * change);
  //   Game.RECTHEIGHT = Game.CANVASHEIGHT / Game.NUMSQUARESY;
  //   Game.RECTWIDTH = Game.CANVASHEIGHT / Game.NUMSQUARESY;
  //   if (this.random) {
  //     this.start();
  //   } else {
  //     this.objectPlaceClick();
  //   }
  //
  //   this.squares = {};
  //   this.addSquares();
  //   this.addLiveCount();
  // }

  startButton() {
    const start = document.getElementById("start");
    start.addEventListener("click", this.start.bind(this));

  }

  start() {
    this.random = true;
    this.squares = {};
    this.addSquares();
    this.addLiveCount();
  }

  displayButton() {
    const displayButton = document.getElementById("display-option");
    displayButton.addEventListener("change", this.changeDisplay.bind(this));
  }

  changeDisplay(e) {
    const option = e.currentTarget.value;
    if (option ==="default") {
      this.followPath = false;
      this.fill = false;
    } else if (option === "grid") {
      this.toggleFollowPath();
    } else if (option === "fill"){
      this.toggleFillPath();
    }
  }

  changeColorButton() {
    const changeColor = document.getElementById("change-colors");
    changeColor.addEventListener("change", this.changeColor.bind(this));
  }

  changeColor(e) {
    this.randomColors = false;
    this.rainbowStep = false;
    const type = e.currentTarget.value;
    if (type == "random-color") {
      this.randomColors = true;
    } else if (type == "rainbow-color"){
      this.rainbowStep = true;
    }
  }

  squareClick() {
    const canvas = this.canvas;
    canvas.addEventListener("click", this.giveSquareLife.bind(this));
    // canvas.addEventListener("mousemove", this.giveSquareLife.bind(this));
  }

  giveSquareLife(event) {
    const xPos = Math.floor(event.layerX / Util.rectSize());
    const yPos = Math.floor(event.layerY / Util.rectSize());
    const square = this.squares[[xPos, yPos]];
    if (square.live) {
      square.live = false;
      if (this.followPath) {
        this.context.clearRect(square.canvasPosition[0], square.canvasPosition[1], square.width, square.height);
        this.context.fillStyle = square.pathColor;
        this.context.fillRect(square.canvasPosition[0], square.canvasPosition[1], square.width, square.height);
      } else {
        this.context.clearRect(square.canvasPosition[0], square.canvasPosition[1], square.width, square.height);
      }
    } else {
      square.live = true;
      this.context.fillStyle = square.color;
      this.context.fillRect(square.canvasPosition[0], square.canvasPosition[1], square.width, square.height);
    }
  }

  stepOnOffButton() {
    const stepOnOff = document.getElementById("step-on-off");
    this.addPause(stepOnOff);
    const step = document.getElementById("step");
    step.style.display = "none";
    stepOnOff.addEventListener("click", this.toggleStep.bind(this));
  }

  addPause(node) {
    const i = document.createElement("i");
    i.classList.add("fa", "fa-pause", "fa-lg");
    const ariaHidden = document.createAttribute("aria-hidden");
    ariaHidden.value = "true";
    i.setAttributeNode(ariaHidden);
    node.appendChild(i);
  }

  addPlay(node) {
    const i = document.createElement("i");
    i.classList.add("fa", "fa-play", "fa-lg");
    const ariaHidden = document.createAttribute("aria-hidden");
    ariaHidden.value = "true";
    i.setAttributeNode(ariaHidden);
    node.appendChild(i);
  }

  toggleStep(e) {
    const step = document.getElementById("step");
    if (this.step) {
      this.step = false;
      const play = document.getElementsByClassName("fa-play")[0];
      e.currentTarget.removeChild(play);
      this.addPause(e.currentTarget);
      step.style.display = "none";
      return this.step;
    }
    const pause = document.getElementsByClassName("fa-pause")[0];
    e.currentTarget.removeChild(pause);
    this.addPlay(e.currentTarget);
    step.style.display = "";
    this.step = true;
  }


  stepButton() {
    const step = document.getElementById("step");
    step.addEventListener("click", this.step.bind(this));
  }

  step() {
    // if (this.isStatic(Game.RANGE)) {
    //   console.log(this.staticMatch(Game.RANGE));
    // }
    // if (this.isOscillating(Game.RANGE)) {
    //   console.log(this.oscillatingMatch(Game.RANGE));
    // }

    this.changeSquares();
    this.draw(this.context);
  }

  toggleFollowPath() {
    this.followPath = true;
  }

  toggleFillPath() {
    this.followPath = false;
    this.fill = true;
  }

  objectAttackClick(objectName) {
    Game.RANDOMOBJECTS = false;
    Game.PLACEOBJECTS = false;
    Game.OBJECTATTACK = true;
    this.random = false;
    this.squares = {};
    this.addSquares();
    if (objectName === "random") {
      this.randomObjectsClick(100);
    } else {
      this.objectAttack(objectName);
    }
    this.addLiveCount();
  }

  countButton() {
    const count = document.getElementById("object-place-count-input");
    count.addEventListener("change", this.objectPlaceClick.bind(this));
  }

  objectNameButton() {
    const objectName = document.getElementById("object-place-input");
    objectName.addEventListener("change", this.objectPlaceClick.bind(this));
  }

  objectPlaceClick() {
    Game.RANDOMOBJECTS = false;
    Game.PLACEOBJECTS = true;
    Game.OBJECTATTACK = false;
    this.random = false;

    const count = document.getElementById("object-place-count-input").value;
    const objectName = document.getElementById("object-place-input").value;
    if (count === "fill") {
      this.objectAttackClick(objectName);
    } else {
      if (objectName === "random") {
        this.randomObjectsClick(count);
      } else {
        this.squares = {};
        this.addSquares();
        this.placeObjects(objectName, parseInt(count));
        this.addLiveCount();
      }
    }
  }

  randomObjectsClick(count) {
    Game.RANDOMOBJECTS = true;
    Game.PLACEOBJECTS = false;
    Game.OBJECTATTACK = false;
    this.random = false;

    this.squares = {};
    this.addSquares();

    this.placeRandomObjectsRandomly(count);
    this.addLiveCount();
  }

  findLivePositions(range) {
    const lives = [];
    for (let i = range[0][0]; i < range[1][0]; i++) {
      for (let j = range[0][1]; j < range[1][1]; j++) {
        if (this.squares[[i, j]].live) {
          lives.push([i, j]);
        }
      }
    }
    return lives;
  }

  findDeadPositions(range) {
    const deads = [];
    for (let i = range[0][0]; i < range[1][0]; i++) {
      for (let j = range[0][1]; j < range[1][1]; j++) {
        if (!this.squares[[i, j]].live) {
          deads.push([i, j]);
        }
      }
    }
    return deads;
  }

  positions([[xStart, yStart], [xEnd, yEnd]]) {
    const positions = [];
    for (let i = xStart; i < xEnd; i++) {
      for (let j = yStart; j < yEnd; j++) {
        positions.push([i, j]);
      }
    }
    return positions;
  }

  isStatic(range) {
    let pattern = true;
    const livePositions = this.findLivePositions(range);
    const deadPositions = this.findDeadPositions(range);
    livePositions.forEach((position) => {
      const living = this.howManyLive(position);
      if (living !== 2 && living !== 3) {
        pattern = false;
      }
    });
    deadPositions.forEach((position) => {
      const living = this.howManyLive(position);
      if (living === 3) {
        pattern = false;
      }
    });
    return pattern;
  }

  isSimpleOscillating() {
    let oscillating = false;
    const livePositions = this.findLivePositions();
    const deadPositions = this.findDeadPositions();

    this.changeSquares();
    let newLivePositions = this.findLivePositions();
    let newDeadPositions = this.findDeadPositions();
    const isStatic = this.isMatching(newLivePositions, livePositions) &&
    this.isMatching(deadPositions, newDeadPositions);

    this.changeSquares();
    newLivePositions = this.findLivePositions();
    newDeadPositions = this.findDeadPositions();
    return this.isMatching(livePositions, newLivePositions) &&
    this.isMatching(deadPositions, newDeadPositions) && !isStatic;
  }

  isMatching(array1, array2) {
    if (array1.length !== array2.length) return false;
    const sorted1 = array1.sort();
    const sorted2 = array2.sort();
    for (let i = 0; i < sorted1.length; i++) {
      for (let j = 0; j < sorted1[i].length; j++) {
        if (sorted1[i][j] !== sorted2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  isOscillating(range) {
    const pattern = [];
    for (let patternCount = 0; patternCount < 16; patternCount++) {
      const livePositions = this.findLivePositions(range);
      const deadPositions = this.findDeadPositions(range);
      pattern.push([livePositions, deadPositions]);
      if (patternCount > 0) {
        const isStatic = this.isMatching(pattern[patternCount - 1][0], livePositions) &&
        this.isMatching(pattern[patternCount - 1][1], deadPositions);
        if (isStatic) return false;
      }
      this.changeSquares();
    }
    return this.isRepeatingPattern(pattern);
  }

  isRepeatingPattern(potPattern) {
    const pattern = [];
    let patternOffset;

    for (let i = 0; i < potPattern.length; i++) {
      if (this.includes(pattern, potPattern[i])) {
        patternOffset = i;
        break;
      } else {
        pattern.push(potPattern[i]);
      }
    }

    if (patternOffset === undefined) return false;
    this.pattern = pattern;
    let check = 0;
    for (let i = 0; i < potPattern.length; i++) {
      check = i % patternOffset;

      if (!this.isMatching(potPattern[i][0], pattern[check][0]) ||
          !this.isMatching(potPattern[i][1], pattern[check][1])) {
        return false;
      }
    }

    return true;
  }

  includes(array, el) {
    for (let i = 0; i < array.length; i++) {
      if (this.isMatching(array[i][0], el[0]) &&
          this.isMatching(array[i][1], el[1])) {
        return true;
      }
    }
    return false;
  }

  staticMatch(range) {
    const lives = this.findLivePositions(range);
    const startingPos = this.findFurthestLeft(lives);
    for (let i = 0; i < Game.STATICOBJECTNAMES.length; i++) {
      const objectPositions = this.constantize(Game.STATICOBJECTNAMES[i])(startingPos);
      if (this.isMatching(objectPositions, lives)) {
        return Game.STATICOBJECTNAMES[i];
      }
    }
    return false;
  }

  oscillatingMatch(range) {
    for (let i = 0; i < Game.OSCILLATINGOBJECTNAMES.length; i++) {
      for (let j = 0; j < this.pattern.length; j++) {
        const lives = this.pattern[j][0];
        const startingPos = this.findFurthestLeft(lives);
        const objectPositions = this.constantize(Game.OSCILLATINGOBJECTNAMES[i])(startingPos);
        // debugger
        if (this.isMatching(objectPositions, lives)) {
          return Game.OSCILLATINGOBJECTNAMES[i];
        }
      }
    }
    return false;
  }

  findFurthestLeft(lives) {
    let left = [Util.NUMSQUARESX, 0];
    lives.forEach(position => {
      if (position[0] <= left[0] && position[1] > left[1]) left = position;
    });
    return left;
  }
}

Game.RANGE = [[0,0], [Util.NUMSQUARESX, Util.NUMSQUARESY]];
Game.STATICOBJECTNAMES = ["block", "beehive", "loaf", "boat", "tub"];
Game.OSCILLATINGOBJECTNAMES = ["blinker", "toad", "beacon",
"pulsar", "pentadecathlon", "clock"];
Game.OBJECTNAMES =
  ["block", "beehive", "loaf", "boat", "tub", "blinker", "toad", "beacon",
  "pulsar", "pentadecathlon", "glider", "lightWeightSpaceship", "clock", "benchmark", "gosperGliderGun"];

Game.OBJECTS = {
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


Game.OBJECTATTACK = false;
Game.RANDOMOBJECTS = false;
Game.PLACEOBJECTS = false;
Game.RANDOMOBJECTSCOUNT = 10;
Game.CANVASWIDTH = Util.CANVASWIDTH;
Game.CANVASHEIGHT = Util.CANVASHEIGHT;
Game.NUMSQUARESY = Util.NUMSQUARESY;
Game.NUMSQUARESX = Util.NUMSQUARESX;
Game.RECTHEIGHT = Game.CANVASHEIGHT / Game.NUMSQUARESY;
Game.RECTWIDTH = Game.CANVASHEIGHT / Game.NUMSQUARESY;

Game.DIM_X = Game.CANVASWIDTH;
Game.DIM_Y = Game.CANVASHEIGHT;
Game.BG_COLOR = "#424949";
Game.ALLPOSITIONS = Util.allPositions();

module.exports = Game;
