const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

let [polymer, ips] = input.split('\n\n');

const steps = ips.split('\n').map((row) => row.split(' -> '));

const stepsMap = {};
steps.forEach(([from, to]) => {
  stepsMap[from] = to;
});

let pairs = {};
for (let i = 0; i < polymer.length - 1; i++) {
  const pair = polymer.slice(i, i + 2);
  pairs[pair] = pairs[pair] ? pairs[pair] + 1 : 1;
}

for (let i = 0; i < 40; i++) {
  let newPairs = {};

  Object.keys(pairs).forEach((pair) => {
    const target = stepsMap[pair];

    if (target) {
      newPairs[pair[0] + target] = newPairs[pair[0] + target]
        ? newPairs[pair[0] + target] + pairs[pair]
        : pairs[pair];
      newPairs[target + pair[1]] = newPairs[target + pair[1]]
        ? newPairs[target + pair[1]] + pairs[pair]
        : pairs[pair];
    }
  });

  pairs = newPairs;
}

const freqs = {};

Object.keys(pairs).forEach((pair) => {
  freqs[pair[0]] = freqs[pair[0]] ? freqs[pair[0]] + pairs[pair] / 2 : pairs[pair] / 2;
  freqs[pair[1]] = freqs[pair[1]] ? freqs[pair[1]] + pairs[pair] / 2 : pairs[pair] / 2;
});

console.log(freqs);

let minFreq2 = Number.POSITIVE_INFINITY;
let maxFreq2 = Number.NEGATIVE_INFINITY;
Object.keys(freqs).forEach((letter) => {
  if (freqs[letter] < minFreq2) {
    minFreq2 = freqs[letter];
  }
  if (freqs[letter] > maxFreq2) {
    maxFreq2 = freqs[letter];
  }
});

console.log(Math.round(maxFreq2 - minFreq2));
