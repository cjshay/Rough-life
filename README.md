### Play Rough Life
[Rough Life](https://cjshay.github.io/Rough-life/)

### Description

Conway's game of life is a 0-player game where rules are set in advance and the game plays out on itself. Each cell on the board is either dead or alive and one "step" is the next iteration of the game. The next step is determined by whether each cell has dead or alive cells around them. If there are enough live cells around them, they will become / or stay alive. If there is not enough or too many, they will die.

- Users can start the game based on randomly assigned squares
- The game moves through iterations based on the rules of the game and renders them at each step

![Game Example](https://github.com/cjshay/Rough-life/raw/gh-pages/assets/images/ex1.png)

### Architecture and Technologies

- Canvas
- JavaScript
- HTML5
- CSS

### Features

- Players can begin the game with a random start
- Players can toggle changes of color, pathfollow, and pathfill
- Players can place an amount of prechosen Conway-type objects
- Players can fill the board with an aforementioned object
- Players can place a number of random objects
- Players can step through iterations one at a time

### Newer and in-process features

#### Square Select

One feature that I recently implemented is where user's can select squares
in order to make them dead or alive by clicking on them either when the game is on-going or when
the game is in "Step" or pause mode. This is really useful for players
who are just getting the hand of Conway's game of life rules. They can create
and manipulate objects in real time in order to see how the rules work in real-time!

I implemented this feature by binding an event listener to the canvas for clicks:
(this function gets called when the game is loading)
```javascript
squareClick() {
  const canvas = this.canvas;
  canvas.addEventListener("click", this.giveSquareLife.bind(this));
}
```

Afterwards, I use the position of the mouse in the event in order to find out
which square needs to be changed and change it to either dead or alive:

```javascript
giveSquareLife(event) {
  const xPos = Math.floor(event.layerX / Util.rectSize());
  const yPos = Math.floor(event.layerY / Util.rectSize());
  const square = this.squares[[xPos, yPos]];
}
```

####Game Feature

One useful thing about the clicking feature is that it leads to a potential
version of the game that is much more game-like. In this version,
players would be given the rules, some examples of Conway static shapes
(ex: a 2 x 2 block) or an oscillating shape (ex: a blinker, or straight line of 3 blocks)
and then be prompted to create either a static or oscillating shape on their own.

This feature is still in development, but the basic methods have been created.
I created functions that given a section of the grid tell whether that section
is static or oscillating. This is done by checking the next iteration of the
section against the original version:
```javascript
isOscillating(range) {
  const pattern = [];
  for (let patternCount = 0; patternCount < 16; patternCount++) {
    const livePositions = this.findLivePositions(range);
    const deadPositions = this.findDeadPositions(range);
    pattern.push([livePositions, deadPositions]);
    if (patternCount > 0) {
      const isStatic = this.isMatching(pattern[patternCount - 1][0], livePositions) &&
      this.isMatching(pattern[patternCount - 1][1], deadPositions);
      if (isStatic) return false;
    }
    this.changeSquares();
  }
  return this.isRepeatingPattern(pattern);
}
```

### Future Directions for Project

#### Placing objects based on text files from internet

This will be implemented using an API where users can input a file that creates
a Conway-type-object and let them place it on the board where they prefer.
