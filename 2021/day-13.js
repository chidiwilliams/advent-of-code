const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const [points, folds] = input.split('\n\n');

const pts = points.split('\n').map((row) => row.split(',').map(Number));

const flds = folds.split('\n').map((row) => row.replace('fold along ', '').split('='));

let maxW = Number.NEGATIVE_INFINITY;
let maxH = Number.NEGATIVE_INFINITY;
pts.forEach(([x, y]) => {
  if (x > maxW) {
    maxW = x;
  }
  if (y > maxH) {
    maxH = y;
  }
});
let grid = Array.from({ length: maxH + 1 }, () => Array.from({ length: maxW + 1 }, () => false));

pts.forEach(([x, y]) => {
  grid[y][x] = true;
});

flds.forEach((fold) => {
  const foldPosition = Number(fold[1]);
  if (fold[0] === 'y') {
    // Copy old points
    const newGrid = Array.from({ length: foldPosition }, (_, i) =>
      ((i) => Array.from({ length: grid[0].length }, (_, j) => grid[i][j]))(i),
    );

    // fold rest of grid
    grid.forEach((row, i) => {
      if (i > foldPosition) {
        row.forEach((_, j) => {
          const x = j;
          const y = foldPosition - (i - foldPosition);
          if (grid[i][j] && !newGrid[y][x]) {
            newGrid[y][x] = true;
          }
        });
      }
    });

    grid = newGrid;
  } else {
    // Copy old points
    const newGrid = Array.from({ length: grid.length }, (_, i) =>
      ((i) => Array.from({ length: foldPosition }, (_, j) => grid[i][j]))(i),
    );

    // Fold rest of grid
    grid.forEach((row, i) => {
      row.forEach((_, j) => {
        if (j > foldPosition) {
          const x = foldPosition - (j - foldPosition);
          const y = i;
          if (grid[i][j] && !newGrid[y][x]) {
            newGrid[y][x] = true;
          }
        }
      });
    });

    grid = newGrid;
  }
});

const count = grid.flat(1).filter((cell) => cell).length;
console.log(count);

console.log(grid.map((row) => row.map((cell) => (cell ? '#' : ' ')).join('')));
