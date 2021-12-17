const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt').toString();

const boundary = input
  .replace('target area: ', '')
  .split(', ')
  .map((row) => row.slice(2).split('..').map(Number));

let allMaxY = Number.NEGATIVE_INFINITY;
let numPossibilities = 0;

for (let x = 0; x < boundary[0][1] + 1; x++) {
  for (let y = -1000; y < 1000; y++) {
    const velocity = [x, y];
    const position = [0, 0];

    let maxY = Number.NEGATIVE_INFINITY;

    while (true) {
      position[0] += velocity[0];
      position[1] += velocity[1];

      velocity[0] -= velocity[0] > 0 ? 1 : velocity[0] < 0 ? -1 : 0;
      velocity[1] -= 1;

      maxY = Math.max(maxY, position[1]);

      if (
        position[0] >= boundary[0][0] &&
        position[0] <= boundary[0][1] &&
        position[1] >= boundary[1][0] &&
        position[1] <= boundary[1][1]
      ) {
        console.log('hit:', position, velocity, maxY);
        allMaxY = Math.max(allMaxY, maxY);
        numPossibilities++;
        break;
      }

      if (position[0] > boundary[0][1] || position[1] < boundary[1][0]) {
        // console.log('no hit', [x, y]);
        break;
      }
    }
  }
}

console.log(allMaxY, numPossibilities);
