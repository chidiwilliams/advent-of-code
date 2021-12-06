const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

let list = input.split('\n')[0].split(',').map(Number);

let inputMap = {};
for (let i = 0; i < 9; i++) {
  inputMap[i] = 0;
}
list.forEach((elem) => {
  inputMap[elem]++;
});

for (let i = 0; i < 256; i++) {
  const nextMap = {};

  for (let j = 0; j <= 8; j++) {
    if (j > 0) {
      nextMap[j - 1] = inputMap[j];
    }
  }

  // make 6s of 0
  const numZeroes = inputMap[0];
  if (nextMap[6]) {
    nextMap[6] += numZeroes;
  } else {
    nextMap[6] = numZeroes;
  }

  // push 8s
  nextMap[8] = numZeroes;

  inputMap = nextMap;
}

const len = Object.values(inputMap).reduce((x, acc) => x + acc, 0);
console.log(len);
