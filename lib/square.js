const Util = require("./util");


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
