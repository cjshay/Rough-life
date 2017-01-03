### Play Rough Life
[Rough Life](https://cjshay.github.io/rough-life/)

### Description

Conway's game of life is a 0-player game where rules are set in advance and the game plays out on itself. Each cell on the board is either dead or alive and one "step" is the next iteration of the game. The next step is determined by whether each cell has dead or alive cells around them. If there are enough live cells around them, they will become / or stay alive. If there is not enough or too many, they will die.

- Users can start the game based on randomly assigned squares
- The game moves through iterations based on the rules of the game and renders them at each step

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

### Future Directions for Project

#### Selecting squares based on user input

I plan to make squares live based on where users click.

#### Placing objects based on text files from internet

This will be implemented using an API where users can input a file that creates
a Conway-type-object and let them place it on the board where they prefer.
