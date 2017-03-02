
const Square = require("./square");
const Util = require("./util");
const LifeObject = require("./life_object");

class Game {
  constructor(context, canvas) {
    this.check = false;
    this.context = context;
    this.canvas = canvas;
    this.color = "white";
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
    return eval("LifeObject." + string);
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

    if (objectDist === LifeObject.gosperGliderGunDist()) {
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
  }

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
}

Game.RANGE = [[0,0], [Util.NUMSQUARESX, Util.NUMSQUARESY]];
Game.STATICOBJECTNAMES = ["block", "beehive", "loaf", "boat", "tub"];
Game.OSCILLATINGOBJECTNAMES = ["blinker", "toad", "beacon",
"pulsar", "pentadecathlon", "clock"];
Game.OBJECTNAMES =
  ["block", "beehive", "loaf", "boat", "tub", "blinker", "toad", "beacon",
  "pulsar", "pentadecathlon", "glider", "lightWeightSpaceship", "clock", "benchmark", "gosperGliderGun"];


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
