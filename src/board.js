import Cell from './cell';

const vectors = {
  right: {x: 1, y:0},
  up: {x: 0, y: -1},
  left: {x: -1, y: 0},
  down: {x: 0, y: 1}
};


class Board {
  constructor () {
    this.boardState = [];
    this.startCells = 2;

    this.populateState();
    this.addStartCells();

  }

  //this needs refactoring...
  move(key) {
    if (key === 'right') {
      for (let col = 3; col >= 0; col--) {
        for (let row = 0; row < 4; row++) {
          if (this.boardState[row][col].val !== null) {
            const coords = {col: col, row: row};
            this.moveSingular(coords, vectors.right);
          }
        }
      }
    } else if (key ==='down') {
      for (let row = 3; row >= 0; row--) {
        for (let col = 0; col < 4; col++) {
          if (this.boardState[row][col].val !== null) {
            const coords = { col, row };
            this.moveSingular(coords, vectors.down);
          }
        }
      }
    } else if (key ==='up') {
      for (let row = 0; row <= 3; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.boardState[row][col].val !== null) {
            const coords = {col: col, row: row};
            this.moveSingular(coords, vectors.up);
          }
        }
      }
    } else if (key ==='left') {
      for (let col = 0; col <= 3; col++) {
        for (let row = 0; row < 4; row++) {
          if (this.boardState[row][col].val !== null) {
            const coords = {col: col, row: row};
            this.moveSingular(coords, vectors.left);
          }
        }
      }
    }
    this.resetMerge();
    if (!this.full()) {
      this.addNumber();
    }
    if (this.checkWon()) {
      alert('You have won!');
    }
  }

  resetMerge() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.boardState[i][j].merged = false;
      }
    }
  }

  checkWon() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.boardState[i][j].val === 2048) {
          return true;
        }
      }
    }
    return false;
  }

  full () {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.boardState[i][j].val === null) {
          return false;
        }
      }
    }
    return true;
  }

  //returns the furthest coordinates it can travel
  //coord of a cell if bumps into a cell,
  //coord of border if bumps into wall
  travelFurthest (coords, vector) {
    const {y, x} = coords;
    if (this.atBounds(vector, coords)) {
      return coords;
    }

    const position = {x, y};
    for (let i = 0; i < 3; i++) {
      position.x += vector.x;
      position.y += vector.y;
      if (this.boardState[position.y][position.x].val !== null || this.atBounds(vector, position)) {
        return position;
      }
    }
  }

  moveSingular (coords, vector) {
    //move the furthest to the vector direction
    const { row, col } = coords;
    const cell = this.boardState[row][col];
    const position = { y: row, x: col }

    //furthest it can go
    const furthest = this.travelFurthest(position, vector);
    let furthestCell = this.boardState[furthest.y][furthest.x]
    //if furthest is the current cell, just return
    if (furthestCell === cell) {
      return;
    }

    if (furthestCell.val) {
      if (furthestCell.val === cell.val && !furthestCell.merged) {
        this.merge(cell, furthestCell);
        return;
      } else {
        furthest.x -= vector.x;
        furthest.y -= vector.y;
        furthestCell = this.boardState[furthest.y][furthest.x];
        this.swap(cell, furthestCell);
        return;
      }
    } else {
      this.swap(cell, furthestCell);
      return;
    }
    return;
  }

  swap(from, to) {
    if (from !== to) {
      to.val = from.val;
      from.val = null;
    }
  }

  merge (from, to) {
    from.val = null;
    to.val *= 2;
    to.merged = true;
  }

  atBounds (direction, coords) {
    const { x, y} = coords;
    switch (direction) {
      case vectors.right:
        return x === 3;
      case vectors.up:
        return y === 0;
      case vectors.left:
        return x === 0;
      case vectors.down:
        return y === 3;
      default:
        return false;
    }
  }

  outOfBounds (position) {
    const { y, x } = position;
    return y < 0 || y > 3 || x < 0 || x > 3;
  }

  inBounds (y, x) {
    return y >= 0 && y <= 3 && x >= 0 && x <= 3;
  }

  getState () {
    return this.boardState.map(row => (row.map(cell => cell.val)));
  }

  addStartCells () {
    for (let i = 0; i < this.startCells; i++) {
      this.addNumber();
    }
  }

  //adds a 2 or 4 to the current board state, randomly wherever available
  addNumber() {
    const coords = this.emptyCells();
    if (coords.length > 0) {
      const [row,col] = coords[Math.floor(Math.random()*coords.length)];
      const rand24 = Math.random() < 0.9 ? 2 : 4;
      this.boardState[row][col].val = rand24;
    }
  }

  //returns the coordinates of all empty cells
  emptyCells() {
    const result = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.boardState[i][j].val === null) {
          result.push([i,j]);
        }
      }
    }
    return result;
  }

  populateState() {
    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let j = 0; j < 4; j++) {
        row.push(new Cell(null));
      }
      this.boardState.push(row);
    }
  }
}

export default Board;
