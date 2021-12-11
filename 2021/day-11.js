const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const levels = input.split('\n').map((row) => row.split('').map(Number));

let numFlashes = 0;
let firstAllFlash = 0;

for (let step = 0; step < 2000; step++) {
  levels.forEach((row, i) => {
    row.forEach((_, j) => {
      row[j]++;
    });
  });

  let prevNumFlashes = numFlashes;

  levels.forEach((row, i) => {
    row.forEach((_, j) => {
      if (row[j] > 9) {
        checkFlashes(levels, i, j);
      }
    });
  });

  if (numFlashes - prevNumFlashes === levels.length * levels[0].length && firstAllFlash === 0) {
    firstAllFlash = step + 1;
  }

  function checkFlashes(levels, row, col) {
    if (levels[row][col] === 10) {
      numFlashes++;
      levels[row][col] = 0;
    }

    for (let rowD = -1; rowD <= 1; rowD++) {
      for (let colD = -1; colD <= 1; colD++) {
        if (
          !(rowD === 0 && colD === 0) &&
          levels[row + rowD] !== undefined &&
          levels[row + rowD][col + colD] !== undefined &&
          levels[row + rowD][col + colD] !== 10 &&
          levels[row + rowD][col + colD] !== 0
        ) {
          levels[row + rowD][col + colD]++;
          if (levels[row + rowD][col + colD] > 9) {
            checkFlashes(levels, row + rowD, col + colD);
          }
        }
      }
    }
  }
}

console.log(numFlashes, firstAllFlash);
