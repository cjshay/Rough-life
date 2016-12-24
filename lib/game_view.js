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
