const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const movements = input
  .split('\n')
  .map((line) => line.split(' '))
  .map(([direction, distance]) => [direction, +distance]);

{
  // Part 1
  let horizontal = 0;
  let depth = 0;

  for (let i = 0; i < movements.length; i++) {
    const [direction, distance] = movements[i];
    switch (direction) {
      case 'forward':
        horizontal += distance;
        break;
      case 'down':
        depth += distance;
        break;
      case 'up':
        depth -= distance;
        break;
    }
  }

  console.log(horizontal * depth);
}

{
  // Part 2
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  for (let i = 0; i < movements.length; i++) {
    const [direction, distance] = movements[i];
    switch (direction) {
      case 'forward':
        horizontal += distance;
        depth += aim * distance;
        break;
      case 'down':
        aim += distance;
        break;
      case 'up':
        aim -= distance;
        break;
    }
  }

  console.log(horizontal * depth);
}
