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
	    this.changeSquares();
	    this.flow = false;
	    // only squares has precedent
	    this.onlySquares = false;
	    this.killColor = false;
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
	
	  surroundingSquares(pos) {
	    return Util.surroundingPositions(pos).map(squarepos => {
	      return this.squares[squarepos];
	    });
	  }
	
	  howManyLive(pos) {
	
	    const squares = this.surroundingSquares(pos);
	    return squares.reduce((accum, square) => {
	      if (square !== undefined && square.live) {
	        return accum + 1;
	      } else {
	        return accum;
	      }
	    }, 0);
	  }
	
	  changeSquares() {
	    Game.ALLPOSITIONS.forEach((position) => {
	      return this.squares[position].change(this.howManyLive(position));
	    });
	  }
	
	  draw(context) {
	    if (!this.onlySquares) {
	      if (!this.flow) {
	        context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	        context.fillStyle = Game.BG_COLOR;
	        context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	      }
	    }
	    Game.ALLPOSITIONS.forEach((position) => {
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
	    this.pos = options.pos;
	    this.canvasPosition = options.canvasPosition;
	    this.width = options.width;
	    this.height = options.height;
	    this.color = Square.COLOR;
	    this.game = options.game;
	    this.live = this.randomLiving();
	    this.killColor = "#424949";
	  }
	
	  randomLiving() {
	    if (Math.floor(Math.random() * 100) < Square.PERCENTLIVING) {
	      return true;
	    }
	    return false;
	  }
	  killCell() {
	    this.live = false;
	  }
	
	  raiseCell() {
	    this.live = true;
	  }
	
	  change(surroundLiveCount) {
	    if (this.live === true) {
	      if (surroundLiveCount < 2 || surroundLiveCount > 3) {
	        this.killCell();
	        this.killColor = "#000000";
	      }
	    } else {
	      if (surroundLiveCount === 3) {
	        this.raiseCell();
	      }
	    }
	  }
	
	
	  draw(context) {
	    if (this.live) {
	      // if (this.game.flow) {
	      //   context.clearRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	      // }
	      context.fillStyle = this.color;
	      context.fillRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	    } else {
	      if (this.game.onlySquares) {
	        if (!this.game.flow) {
	          context.clearRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	        }
	        if (this.game.killColor) {
	          context.clearRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	          context.fillStyle = this.killColor;
	          context.fillRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	        }
	        // context.fillStyle = this.killedColor;
	        // context.fillRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	        // context.clearRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	      }
	    }
	  }
	}
	
	Square.COLOR = "#FF0000";
	Square.PERCENTLIVING = 5;
	
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
	Util.NUMSQUARES = 100;
	Util.RECTWIDTH = Util.CANVASWIDTH / Util.NUMSQUARES;
	Util.RECTHEIGHT = Util.CANVASHEIGHT / Util.NUMSQUARES;
	Util.LESSSQUARES = 1;
	
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