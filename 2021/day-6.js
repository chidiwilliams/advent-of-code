const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

let list = input.split('\n')[0].split(',').map(Number);

let inputMap = Array.from({ length: 9 }, () => 0);
list.forEach((elem) => {
  inputMap[elem]++;
});

for (let i = 0; i < 256; i++) {
  const nextMap = Array.from({ length: 9 }, () => 0);

  nextMap.forEach((_, j) => {
    if (j > 0) {
      nextMap[j - 1] = inputMap[j];
    }
  });

  // make 6s of 0
  const numZeroes = inputMap[0];
  nextMap[6] += numZeroes;

  // push 8s
  nextMap[8] = numZeroes;

  inputMap = nextMap;
}

const len = Object.values(inputMap).reduce((x, acc) => x + acc, 0);
console.log(len);
