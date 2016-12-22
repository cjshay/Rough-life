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
	const GameView = __webpack_require__(4);
	
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
	
	class Game {
	  constructor() {
	    this.squares = {};
	    this.addSquares();
	    this.addLiveCount();
	
	    this.fill = false;
	    // only squares has precedent
	    this.onlySquares = true;
	    this.followPath = false;
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
	
	  addLiveCount() {
	    Game.ALLPOSITIONS.forEach((position) => {
	      if (position[0] === 50 && position[1] === 50) {
	      }
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
	      if (position[0] === 50 && position[1] === 50) {
	      }
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
	
	}
	
	Game.DIM_X = Util.CANVASWIDTH;
	Game.DIM_Y = Util.CANVASHEIGHT;
	Game.BG_COLOR = "#424949";
	Game.ALLPOSITIONS = Util.allPositions();
	
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Square {
	  constructor(options) {
	    this.game = options.game;
	    this.pos = options.pos;
	    this.canvasPosition = options.canvasPosition;
	    this.width = options.width;
	    this.height = options.height;
	
	    this.color = this.assignColor();
	    this.live = this.assignLive();
	
	    this.pathColor = "#424949";
	    this.surroundingLivesCount = null;
	  }
	
	  randomLiving() {
	    if (Math.floor(Math.random() * 100) < Square.PERCENTLIVING) {
	      return true;
	    }
	    return false;
	  }
	
	  match(pos, positionList) {
	    let posMatch = false;
	    positionList.forEach(position => {
	      if (position[0] === pos[0] && position[1] === pos[1]) {
	        posMatch = true;
	      }
	    });
	
	    return posMatch;
	  }
	
	  block() {
	    const positionList = [[50,50], [51,50], [50,51], [51,51]];
	    return this.match(this.pos, positionList);
	  }
	
	  beehive() {
	    const positionList = [[50,50], [51,49], [52,49], [53,50], [52, 51], [51, 51]];
	    return this.match(this.pos, positionList);
	  }
	  loaf() {
	    const positionList = [[50,50], [51,49], [52,49], [53,50], [53, 51], [52, 52], [51,51]];
	    return this.match(this.pos, positionList);
	  }
	  boat() {
	    const positionList = [[50,50], [50,49], [51,49], [52,50], [51, 51]];
	    return this.match(this.pos, positionList);
	  }
	  tub() {
	    const positionList = [[50,50], [51,49], [52,50], [51, 51]];
	    return this.match(this.pos, positionList);
	  }
	  blinker() {
	    const positionList = [[50,50], [51,50], [52,50]];
	    return this.match(this.pos, positionList);
	  }
	  toad() {
	    const positionList = [[50,50], [51,49], [52,49], [53,49], [52, 50], [51, 50]];
	    return this.match(this.pos, positionList);
	  }
	  beacon() {
	    const positionList = [[50,50], [51,50], [50,51], [51,51], [52, 52], [53, 53], [52, 53], [53, 52]];
	    return this.match(this.pos, positionList);
	  }
	  pulsar() {
	    const positionList = [[50,50], [51,49], [52,49], [53,50], [52, 51], [51, 51]];
	    return this.match(this.pos, positionList);
	  }
	  pentadecathlon() {
	    const positionList = [[50,50], [51,49], [52,49], [53,50], [52, 51], [51, 51]];
	    return this.match(this.pos, positionList);
	  }
	  glider() {
	    const positionList = [[50,50], [51,50], [52,50], [52,49], [51, 48]];
	    return this.match(this.pos, positionList);
	  }
	  lightWeightSpaceship() {
	    const positionList = [[50,50], [51,49], [52,49], [53,49], [54, 49], [54, 50], [54,51], [53, 52], [50, 52]];
	    return this.match(this.pos, positionList);
	  }
	
	
	
	
	
	
	  assignLive() {
	    if (Square.randomLiving) {
	      return this.randomLiving();
	    } else if (Square.block) {
	      return this.block();
	    } else if (Square.beehive) {
	      return this.beehive();
	    } else if (Square.loaf) {
	      return this.loaf();
	    } else if (Square.boat) {
	      return this.boat();
	    } else if (Square.tub) {
	      return this.tub();
	    } else if (Square.blinker) {
	      return this.blinker();
	    } else if (Square.toad) {
	      return this.toad();
	    } else if (Square.beacon) {
	      return this.beacon();
	    } else if (Square.pulsar) {
	      return this.pulsar();
	    } else if (Square.pentadecathlon) {
	      return this.pentadecathlon();
	    } else if (Square.glider) {
	      return this.glider();
	    } else if (Square.lightWeightSpaceship) {
	      return this.lightWeightSpaceship();
	    } else {
	      return this.randomLiving();
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
	      return Square.COLOR;
	    }
	  }
	
	  stepColor() {
	    return Square.COLORS[(Square.COLORS.indexOf(this.color) + 1) % Square.COLORS.length];
	  }
	
	  randomColor() {
	    return Square.COLORS[Math.floor(Math.random() * Square.COLORS.length)];
	  }
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
	
	Square.COLOR = "red";
	Square.PERCENTLIVING = 5;
	Square.randomLiving = false;
	Square.block = false;
	Square.beehive = false;
	Square.loaf = false;
	Square.boat = false;
	Square.tub = false;
	Square.blinker = true;
	Square.toad = false;
	Square.beacon = false;
	Square.pulsar = false;
	Square.pentadecathlon = false;
	Square.glider = false;
	Square.lightWeightSpaceship = false;
	
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
	Util.LESSSQUARES = 1;
	Util.NUMSQUARES = 100 * Util.LESSSQUARES;
	Util.RECTWIDTH = Util.CANVASWIDTH / Util.NUMSQUARES;
	Util.RECTHEIGHT = Util.CANVASHEIGHT / Util.NUMSQUARES;
	
	module.exports = Util;


/***/ },
/* 4 */
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