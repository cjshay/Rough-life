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
