const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt').toString();

const players = input.split('\n').map((row) => Number(row.slice(28)));

let lastRoll = 0;
let nRolls = 0;

function rollDice() {
  const rolls = [];
  for (let i = 0; i < 3; i++) {
    rolls.push(++lastRoll);
    nRolls++;
  }
  return rolls;
}

function sum(arr) {
  return arr.reduce((acc, x) => acc + x, 0);
}

{
  let p1Position = players[0];
  let p2Position = players[1];
  let p1Score = 0;
  let p2Score = 0;

  while (true) {
    p1Position = ((p1Position + sum(rollDice()) - 1) % 10) + 1;
    p1Score += p1Position;
    if (p1Score >= 1000) {
      break;
    }

    p2Position = ((p2Position + sum(rollDice()) - 1) % 10) + 1;
    p2Score += p2Position;
    if (p2Score >= 1000) {
      break;
    }
  }

  console.log(Math.min(p1Score, p2Score) * nRolls);
}

{
  const scores = playWithDiracDice(players[0], players[1]);
  console.log(Math.max(scores[0], scores[1]));
}

function playWithDiracDice(p1p, p2p, p1s = 0, p2s = 0, nextPlayer = 0, memo = {}) {
  if (p1s >= 21) {
    return [1, 0];
  }
  if (p2s >= 21) {
    return [0, 1];
  }

  const memoId = `${p1p}-${p2p}-${p1s}-${p2s}-${nextPlayer}`;
  if (memo[memoId]) {
    return memo[memoId];
  }

  const scores = [0, 0];
  let currPos = nextPlayer === 0 ? p1p : p2p;
  let currScore = nextPlayer === 0 ? p1s : p2s;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        const nextPos = ((currPos + (i + 1) + (j + 1) + (k + 1) - 1) % 10) + 1;
        const nextScore = currScore + nextPos;

        const childScores = playWithDiracDice(
          nextPlayer === 0 ? nextPos : p1p,
          nextPlayer === 1 ? nextPos : p2p,
          nextPlayer === 0 ? nextScore : p1s,
          nextPlayer === 1 ? nextScore : p2s,
          nextPlayer === 0 ? 1 : 0,
          memo,
        );
        scores[0] += childScores[0];
        scores[1] += childScores[1];
      }
    }
  }

  memo[memoId] = scores;
  return scores;
}
