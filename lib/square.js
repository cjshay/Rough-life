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
