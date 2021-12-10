const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const illegalCharacterPoints = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};
const openings = { ']': '[', ')': '(', '>': '<', '}': '{' };
const closings = { '[': ']', '(': ')', '<': '>', '{': '}' };
const scores = { ']': 2, ')': 1, '>': 4, '}': 3 };

let points = 0;
let allScores = [];

input.split('\n').forEach((line) => {
  const stack = [];
  let valid = true;

  readline: for (let pos = 0; pos < line.length; pos++) {
    const token = line[pos];

    switch (token) {
      case '[':
      case '(':
      case '{':
      case '<':
        stack.push(token);
        break;
      case ']':
      case ')':
      case '>':
      case '}':
        const last = stack.pop();

        const expectedOpening = openings[token];
        if (last !== expectedOpening) {
          points += illegalCharacterPoints[token];
          valid = false;
          break readline;
        }
        break;
      default:
        break;
    }
  }

  if (valid) {
    let score = 0;

    while (stack.length > 0) {
      const token = stack.pop();
      score *= 5;
      score += scores[closings[token]];
    }

    allScores.push(score);
  }
});

allScores.sort((a, b) => b - a);

console.log(points, allScores[(allScores.length - 1) / 2]);
