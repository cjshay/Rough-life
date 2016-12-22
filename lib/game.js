const Square = require("./square");
const Util = require("./util");

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
