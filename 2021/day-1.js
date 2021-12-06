const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const list = input.split('\n').map(parseFloat);

let num = 0;

for (let i = 1; i < list.length; i++) {
  if (list[i] > list[i - 1]) {
    num++;
  }
}

let num2 = 0;

for (let i = 1; i < list.length - 2; i++) {
  if (list[i + 2] > list[i - 1]) {
    num2++;
  }
}

console.log(num, num2);
