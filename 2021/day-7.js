const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const positions = input.split('\n')[0].split(',').map(Number);

let maxPos = Number.NEGATIVE_INFINITY;
let minPos = Number.POSITIVE_INFINITY;
positions.forEach((pos) => {
  if (pos > maxPos) {
    maxPos = pos;
  }
  if (pos < minPos) {
    minPos = pos;
  }
});

{
  // Part 1
  let minSum = Number.POSITIVE_INFINITY;
  let minSumValue;

  for (let eachPos = minPos; eachPos < maxPos; eachPos++) {
    let sum = 0;

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      sum += Math.abs(eachPos - pos);
    }

    if (sum < minSum) {
      minSum = sum;
      minSumValue = eachPos;
    }
  }

  console.log(minSumValue, minSum);
}

{
  // Part 2
  let minSum = Number.POSITIVE_INFINITY;
  let minSumValue;

  for (let eachPos = minPos; eachPos < maxPos; eachPos++) {
    let sum = 0;

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const d = Math.abs(eachPos - pos);
      sum += Math.abs((d * (d + 1)) / 2);
    }

    if (sum < minSum) {
      minSum = sum;
      minSumValue = eachPos;
    }
  }

  console.log(minSumValue, minSum);
}
