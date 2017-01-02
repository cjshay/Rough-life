/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(5);
	
	document.addEventListener("DOMContentLoaded", function() {
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  const context = canvasEl.getContext("2d");
	  const game = new Game();
	  new GameView(game, context).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Square = __webpack_require__(2);
	const Util = __webpack_require__(3);
	const Buttons = __webpack_require__(4);
	
	class Game {
	  constructor() {
	    this.color = "red";
	    this.percentLiving = 10;
	    this.fill = false;
	    this.onlySquares = true;
	    this.followPath = false;
	    this.randomColors = false;
	    this.rainbowStep = false;
	    this.bindButtons();
	    this.random = false;
	    // only squares has precedent
	
	    this.squares = {};
	    this.addSquares();
	    this.addLiveCount();
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
	      this.objectAttack("glider");
	    }
	
	    if (Game.PLACEOBJECTS) {
	      this.placeObjects("gosperGliderGun", 8);
	    }
	
	    if (Game.RANDOMOBJECTS) {
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
	    const randomObjectName = Game.OBJECTNAMES[Math.floor(Math.random() * Game.OBJECTNAMES.length)];
	
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
	        if (position[0] < Util.NUMSQUARESX && position[1] < Util.NUMSQUARESY && position[0] > 0 && position[1] > 0) {
	          this.squares[position].live = true;
	        }
	      });
	
	      return true;
	    }
	  }
	
	  placeObjects(objectName, count) {
	    // TODO: REALLY HACKY CHANGE THIS CODE
	    let objCount = count;
	    if (objectName === "gosperGliderGun" && count >= 8) {
	      objCount = 10;
	    }
	    const findDist = this.constantize(`${objectName}Dist`);
	    const distBetween = findDist();
	
	    let offset = 0;
	
	    const shipsCountX = Math.floor(Math.sqrt(objCount));
	    const shipsCountY = Math.floor(Math.sqrt(objCount)) + 1;
	
	    const paddingX = Math.floor(Util.NUMSQUARESX / (shipsCountX + 1));
	    const paddingY = Math.floor(Util.NUMSQUARESY / (shipsCountY + 1));
	
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
	
	  bindButtons() {
	    this.rainbowStepButton();
	    this.randomColorsButton();
	    this.followPathButton();
	    this.objectAttackButtons();
	    this.objectPlaceButtons();
	    this.randomObjectsButton();
	    this.percentLivingButton();
	    this.startButton();
	    this.fillPathButton();
	  }
	
	
	  rainbowStepButton() {
	    const rainbow = document.getElementById("rainbow-step");
	    rainbow.addEventListener("click", this.toggleRainbowStep.bind(this));
	  }
	
	  toggleRainbowStep() {
	    this.randomColors = false;
	    if (this.rainbowStep) {
	      this.rainbowStep = false;
	      return this.rainbowStep;
	    }
	    this.rainbowStep = true;
	    return this.rainbowStep;
	  }
	
	  randomColorsButton() {
	    const randomColors = document.getElementById("random-colors");
	    randomColors.addEventListener("click", this.toggleRandomColors.bind(this));
	  }
	
	  toggleRandomColors() {
	    this.rainbowStep = false;
	    if (this.randomColors) {
	      this.randomColors = false;
	      return this.randomColors;
	    }
	    this.randomColors = true;
	    return this.randomColors;
	  }
	
	  followPathButton() {
	    const followPath = document.getElementById("follow-path");
	    followPath.addEventListener("click", this.toggleFollowPath.bind(this));
	  }
	
	  toggleFollowPath() {
	    if (this.followPath) {
	      this.followPath = false;
	      return this.followPath;
	    }
	    this.followPath = true;
	    return this.followPath;
	  }
	
	  fillPathButton() {
	    const fillPath = document.getElementById("fill-path");
	    fillPath.addEventListener("click", this.togglefillPath.bind(this));
	  }
	
	  togglefillPath() {
	    this.followPath = false;
	    if (this.fill) {
	      this.fill = false;
	      return this.fill;
	    }
	    this.fill = true;
	    return this.fill;
	  }
	
	  startButton() {
	    const startButton = document.getElementById('start');
	    startButton.addEventListener("click", this.startClick.bind(this));
	  }
	
	  startClick(e) {
	    this.percentLiving = 10;
	    this.random = true;
	    this.squares = {};
	    this.addSquares();
	    this.addLiveCount();
	  }
	
	  percentLivingButton() {
	    const percentLivingButton = document.getElementById('percent-living');
	    percentLivingButton.addEventListener("click", this.percentLivingClick.bind(this));
	  }
	
	  percentLivingClick(e) {
	    const percent = document.getElementById("percent-living-input").value;
	    this.percentLiving = parseInt(percent);
	    this.squares = {};
	    this.addSquares();
	    this.addLiveCount();
	  }
	
	  objectAttackButtons() {
	    const objectButtons = document.getElementsByClassName('object-attack');
	    for (let i = 0; i < objectButtons.length; i++) {
	      objectButtons[i].addEventListener("click", this.objectAttackClick.bind(this));
	    }
	  }
	
	  objectAttackClick(e) {
	    Game.RANDOMOBJECTS = false;
	    Game.PLACEOBJECTS = false;
	    Game.OBJECTATTACK = true;
	    this.random = false;
	    this.squares = {};
	    this.addSquares();
	    const objectName = document.getElementById("object-attack-input").value;
	    this.objectAttack(objectName);
	    this.addLiveCount();
	  }
	
	  objectPlaceButtons() {
	    const objectButtons = document.getElementsByClassName('object-place');
	    for (let i = 0; i < objectButtons.length; i++) {
	      objectButtons[i].addEventListener("click", this.objectPlaceClick.bind(this));
	    }
	  }
	
	  objectPlaceClick(e) {
	    Game.RANDOMOBJECTS = false;
	    Game.PLACEOBJECTS = true;
	    Game.OBJECTATTACK = false;
	    this.random = false;
	
	    this.squares = {};
	    this.addSquares();
	    const count = document.getElementById("object-place-count-input").value;
	    const objectName = document.getElementById("object-place-input").value;
	    this.placeObjects(objectName, parseInt(count));
	    this.addLiveCount();
	  }
	  // if (Game.RANDOMOBJECTS) {
	  //   this.placeRandomObjectsRandomly(Game.RANDOMOBJECTSCOUNT);
	  // }
	
	  randomObjectsButton() {
	    const randomObjectsButton = document.getElementById('random-objects');
	    randomObjectsButton.addEventListener("click", this.randomObjectsClick.bind(this));
	  }
	
	  randomObjectsClick(e) {
	    Game.RANDOMOBJECTS = true;
	    Game.PLACEOBJECTS = false;
	    Game.OBJECTATTACK = false;
	    this.random = false;
	
	    this.squares = {};
	    this.addSquares();
	
	    const count = parseInt(document.getElementById("random-object-count-input").value);
	    this.placeRandomObjectsRandomly(count);
	    this.addLiveCount();
	  }
	
	
	
	}
	
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
	
	Game.DIM_X = Util.CANVASWIDTH;
	Game.DIM_Y = Util.CANVASHEIGHT;
	Game.BG_COLOR = "#424949";
	Game.ALLPOSITIONS = Util.allPositions();
	
	Game.OBJECTATTACK = false;
	Game.RANDOMOBJECTS = false;
	Game.PLACEOBJECTS = false;
	Game.RANDOMOBJECTSCOUNT = 10;
	
	
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	
	
	class Square {
	  constructor(options) {
	    this.game = options.game;
	    this.pos = options.pos;
	    this.canvasPosition = options.canvasPosition;
	    this.width = options.width;
	    this.height = options.height;
	    this.color = this.assignColor();
	    this.assignLive();
	
	    this.pathColor = "#424949";
	    this.surroundingLivesCount = null;
	  }
	
	  random() {
	    if (Math.floor(Math.random() * 100) < this.game.percentLiving) {
	      this.live = true;
	    } else {
	      this.live = false;
	    }
	  }
	
	
	  assignLive() {
	    if (this.game.random) {
	      this.random();
	    }
	  }
	  killCell() {
	    this.live = false;
	  }
	
	  raiseCell() {
	    this.color = this.assignColor();
	    this.live = true;
	  }
	
	  change(surroundLiveCount) {
	    if (this.live === true) {
	      if (surroundLiveCount < 2 || surroundLiveCount > 3) {
	        this.killCell();
	        this.pathColor = "#000000";
	      }
	    } else {
	      if (surroundLiveCount === 3) {
	        this.raiseCell();
	      }
	    }
	  }
	
	
	
	  draw(context) {
	    if (this.live) {
	      context.fillStyle = this.color;
	      context.fillRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	    } else {
	      if (this.game.onlySquares) {
	        if (!this.game.fill) {
	          context.clearRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	        }
	        if (this.game.followPath) {
	          context.clearRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	          context.fillStyle = this.pathColor;
	          context.fillRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	        }
	      }
	    }
	  }
	
	  assignColor() {
	    if (this.game.randomColors) {
	      return this.randomColor();
	    } else if (this.game.rainbowStep){
	      return this.stepColor();
	    } else {
	      return this.game.color;
	    }
	  }
	
	  stepColor() {
	    return Square.COLORS[(Square.COLORS.indexOf(this.color) + 1) % Square.COLORS.length];
	  }
	
	  randomColor() {
	    return Square.COLORS[Math.floor(Math.random() * Square.COLORS.length)];
	  }
	
	  // match(pos, positionList) {
	  //   let posMatch = false;
	  //   positionList.forEach(position => {
	  //     if (position[0] === pos[0] && position[1] === pos[1]) {
	  //       posMatch = true;
	  //     }
	  //   });
	  //
	  //   return posMatch;
	  // }
	
	}
	Square.COLORS = [
	  "red",
	  "orange",
	  "yellow",
	  "green",
	  "blue",
	  "indigo",
	  "violet"
	];
	
	
	
	module.exports = Square;


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {



/***/ },
/* 5 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, context) {
	    this.game = game;
	    this.context = context;
	  }
	
	  start() {
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate() {
	    this.game.changeSquares();
	    this.game.draw(this.context);
	    requestAnimationFrame(this.animate.bind(this));
	  }
	}
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map