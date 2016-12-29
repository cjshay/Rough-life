

### MVPs

Conway's game of life is a 0-player game where rules are set in advance and the game plays out on itself. Each cell on the board is either dead or alive and one "step" is the next iteration of the game. The next step is determined by whether each cell has dead or alive cells around them. If there are enough live cells around them, they will become / or stay alive. If there is not enough or too many, they will die.

- Users can start the game based on randomly assigned squares
- The game moves through iterations based on the rules of the game and renders them at each step

### Architecture and Technologies

- Canvas will be used for DOM rendering
- Vanilla JS will guide the logic of the game and each step's placement/iteration

### Wireframe

![wireframe](https://github.com/cjshay/rough-life/blob/gh-pages/docs/life-wireframe.png)

### Implementation Timeline

**Phase 1**: Construct the logic of the project. Make sure that each step in the game represents the correct state determined by the rules of the game, no matter the starting position

**Phase 2**: Create a basic rendering that colors live cells in one color and dead cells in another. Connect the rendering to one step of rendering of the app.

**Phase 3**: Connect the rendering of one step to a live rendering of the game.
