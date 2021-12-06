const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const data = input
  .split('\n')
  .map((row) => row.split(' -> ').map((cell) => cell.split(',').map(Number)));

let maxX = -Infinity;
let maxY = -Infinity;
data.forEach((row) => {
  row.forEach((cell) => {
    if (cell[0] > maxX) {
      maxX = cell[0];
    }
    if (cell[1] > maxY) {
      maxY = cell[1];
    }
  });
});

const diag = Array.from({ length: maxY + 1 }, () =>
  Array.from({ length: maxX + 1 }, () => 0),
);

data.forEach((row) => {
  if (row[0][0] === row[1][0] || row[0][1] === row[1][1]) {
    const changingY = row[0][0] === row[1][0];
    if (changingY) {
      for (
        let i = Math.min(row[0][1], row[1][1]);
        i <= Math.max(row[0][1], row[1][1]);
        i++
      ) {
        diag[i][row[0][0]]++;
      }
    } else {
      for (
        let i = Math.min(row[0][0], row[1][0]);
        i <= Math.max(row[0][0], row[1][0]);
        i++
      ) {
        diag[row[0][1]][i]++;
      }
    }
  } else {
    let xd = row[1][0] > row[0][0] ? 1 : -1;
    let yd = row[1][1] > row[0][1] ? 1 : -1;

    for (let i = 0; i < Math.abs(row[0][0] - row[1][0]) + 1; i++) {
      diag[row[0][1] + i * +yd][row[0][0] + i * +xd]++;
    }
  }
});

console.log(diag.flatMap((row) => row).filter((cell) => cell > 1).length);
