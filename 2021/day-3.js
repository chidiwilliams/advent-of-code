const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const data = input.split('\n');

{
  // Part 1
  let gamma = 0;
  let epsilon = 0;

  const len = data[0].length;

  for (let i = 0; i < len; i++) {
    let numZeroes = 0;
    let numOnes = 0;

    for (let j = 0; j < data.length; j++) {
      if (data[j][i] === '0') {
        numZeroes++;
      } else {
        numOnes++;
      }
    }

    const mcb = numZeroes > numOnes ? 0 : 1;
    const lcb = numZeroes < numOnes ? 0 : 1;

    gamma += mcb * Math.pow(2, len - i - 1);
    epsilon += lcb * Math.pow(2, len - i - 1);
  }

  console.log(gamma * epsilon);
}

{
  // Part 2
  const len = data[0].length;

  let oxy = [...data];
  let co2 = [...data];

  while (true) {
    let oxyDone = false;
    let co2Done = false;

    for (let i = 0; i < len && (!oxyDone || !co2Done); i++) {
      if (!oxyDone) {
        let numZeroes = 0;
        let numOnes = 0;

        for (let j = 0; j < oxy.length; j++) {
          if (oxy[j][i] === '0') {
            numZeroes++;
          } else {
            numOnes++;
          }
        }

        const mcb = +(numOnes >= numZeroes);
        const lcb = +(numZeroes > numOnes);

        oxy = oxy.filter((item) => item[i] === String(mcb));
        if (oxy.length === 1) {
          oxyDone = true;
        }
      }

      if (!co2Done) {
        let numZeroes = 0;
        let numOnes = 0;

        for (let j = 0; j < co2.length; j++) {
          if (co2[j][i] === '0') {
            numZeroes++;
          } else {
            numOnes++;
          }
        }

        const mcb = +(numOnes >= numZeroes);
        const lcb = +(numZeroes > numOnes);

        co2 = co2.filter((item) => item[i] === String(lcb));
        if (co2.length === 1) {
          co2Done = true;
        }
      }
    }

    if (oxyDone && co2Done) {
      break;
    }
  }

  console.log(parseInt(oxy[0], 2) * parseInt(co2[0], 2));
}
