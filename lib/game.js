const Square = require("./square");
const Util = require("./util");

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
