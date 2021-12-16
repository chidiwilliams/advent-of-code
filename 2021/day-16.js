const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt').toString();

let bits = input
  .split('')
  .map((hex) => parseInt(hex, 16).toString(2).padStart(4, '0'))
  .join('');

console.log(bits);

let i = 0;

// -1 - ignore
//  0 - reading version
//  1 - reading packet type id
//  2 - reading literal value
//  3 - reading operator length type id
//  4 - reading length of bits
//  5 - parsing sub-packets
//  6 - parsing num sub-packets
let state = 0;

let packetVersion;
let typeID;
let literalValue = '';
let lengthTypeID;
let ssssubPacketLength;
let totalVersion = 0;

const depthInfo = [];

console.log(`\nstart reading`);

const args = [];

while (i < bits.length) {
  if (state === 0) {
    packetVersion = parseInt(bits.slice(i, i + 3), 2);
    totalVersion += packetVersion;

    const currDepthInfo = depthInfo[depthInfo.length - 1];
    if (currDepthInfo && currDepthInfo.numSubPackets) {
      console.log(
        `\nindex: ${i}, reading next sub-packet, ${
          currDepthInfo.numSubPackets - currDepthInfo.currNumSubPackets
        } sub-packets left`,
      );
    } else if (currDepthInfo && currDepthInfo.subPacketLength) {
      console.log(
        `\nindex: ${i}, reading next sub-packet, ${
          currDepthInfo.subPacketLength - (i - currDepthInfo.startIndex)
        } bits left`,
      );
    }

    console.log(`index: ${i}, packet version: ${packetVersion}`);
    i += 3;
    state++;
  } else if (state === 1) {
    typeID = parseInt(bits.slice(i, i + 3), 2);
    console.log(`index: ${i}, type ID: ${typeID}, ${typeID === 4 ? 'literal value' : 'operator'}`);
    i += 3;
    if (typeID !== 4) args.push('(', { typeID });
    state = typeID === 4 ? 2 : 3;
  } else if (state === 2) {
    const value = bits.slice(i + 1, i + 5);
    literalValue += value;

    console.log(`index: ${i}, value: ${value}`);

    if (bits[i] === '0') {
      const currDepthInfo = depthInfo[depthInfo.length - 1];
      if (currDepthInfo && currDepthInfo.numSubPackets) {
        currDepthInfo.currNumSubPackets++;
      }

      console.log(`index: ${i}, ending sub-packet, depth info: ${JSON.stringify(depthInfo)}\n`);

      if (currDepthInfo && currDepthInfo.numSubPackets) {
        if (currDepthInfo.numSubPackets - currDepthInfo.currNumSubPackets > 0) {
          console.log(`index: ${i}, continue reading sub-packets...`);
          args.push(parseInt(literalValue, 2));
          literalValue = '';
          state = 0;
        } else {
          console.log(`index: ${i}, stop sub-packets`);
          args.push(parseInt(literalValue, 2), ')');
          literalValue = '';
          depthInfo.pop();

          while (depthInfo.length > 0) {
            const newLastDepthInfo = depthInfo[depthInfo.length - 1];
            if (newLastDepthInfo.numSubPackets) {
              newLastDepthInfo.currNumSubPackets++;
              if (newLastDepthInfo.currNumSubPackets === newLastDepthInfo.numSubPackets) {
                console.log(`index: ${i}, stop parent sub-packets`);
                args.push(')');
                depthInfo.pop();
              } else {
                break;
              }
            } else if (newLastDepthInfo.subPacketLength) {
              if (i + 5 - newLastDepthInfo.startIndex === newLastDepthInfo.subPacketLength) {
                console.log(`index: ${i}, stop parent sub-packets`);
                args.push(')');
                depthInfo.pop();
              } else {
                break;
              }
            } else {
              break;
            }
          }

          state = depthInfo.length > 0 ? 0 : -1;
        }
      } else if (currDepthInfo && currDepthInfo.subPacketLength) {
        // continue reading
        if (currDepthInfo.subPacketLength - (i + 5 - currDepthInfo.startIndex) > 0) {
          console.log(`index: ${i}, continue reading sub-packets...`);
          args.push(parseInt(literalValue, 2));
          literalValue = '';
          state = 0;
        } else {
          console.log(`index: ${i}, stop sub-packets`);
          args.push(parseInt(literalValue, 2), ')');
          literalValue = '';
          depthInfo.pop();

          while (depthInfo.length > 0) {
            const newLastDepthInfo = depthInfo[depthInfo.length - 1];
            if (newLastDepthInfo.numSubPackets) {
              newLastDepthInfo.currNumSubPackets++;
              if (newLastDepthInfo.currNumSubPackets === newLastDepthInfo.numSubPackets) {
                console.log(`index: ${i}, stop parent sub-packets`);
                args.push(')');
                depthInfo.pop();
              } else {
                break;
              }
            } else if (newLastDepthInfo.subPacketLength) {
              if (i + 5 - newLastDepthInfo.startIndex === newLastDepthInfo.subPacketLength) {
                console.log(`index: ${i}, stop parent sub-packets`);
                args.push(')');
                depthInfo.pop();
              } else {
                break;
              }
            } else {
              break;
            }
          }

          state = depthInfo.length > 0 ? 0 : -1;
        }
      }
    }

    i += 5;
  } else if (state === 3) {
    lengthTypeID = parseInt(bits[i], 2);
    state = lengthTypeID === 0 ? 4 : 6;
    console.log(`index: ${i}, length type ID: ${lengthTypeID}`);
    depthInfo.push({ lengthTypeID });
    i++;
  } else if (state === 4) {
    const subPacketLength = parseInt(bits.slice(i, i + 15), 2);

    depthInfo[depthInfo.length - 1].subPacketLength = subPacketLength;
    depthInfo[depthInfo.length - 1].startIndex = i + 15;

    console.log(`index: ${i}, start sub-packets, depthInfo: ${JSON.stringify(depthInfo)}`);

    i += 15;
    state = 0;
  } else if (state === 5) {
    subPacket = bits.slice(i, i + ssssubPacketLength);
    i++;
    state++;
  } else if (state === 6) {
    const numSubPackets = parseInt(bits.slice(i, i + 11), 2);

    depthInfo[depthInfo.length - 1].numSubPackets = numSubPackets;
    depthInfo[depthInfo.length - 1].currNumSubPackets = 0;
    depthInfo[depthInfo.length - 1].startIndex = i + 11;

    console.log(`index: ${i}, start sub-packets, depthInfo: ${JSON.stringify(depthInfo)}`);
    i += 11;
    state = 0;
  } else {
    i++;
  }
}

console.log('stop reading\n');

function evaluate(expr, index = 0) {
  if (typeof expr === 'number') {
    return expr;
  } else {
    // trim brackets
    if (expr[0] === '(' && expr[expr.length - 1] === ')') {
      expr = expr.slice(1, expr.length - 1);
    }

    const op = expr[0];
    const operands = [];

    let ops = expr.slice(1);

    let i = 0;
    while (i < ops.length) {
      if (ops[i] === '(') {
        // read until this closing bracket
        const subexpr = [];
        let j = i;
        let nested = 0;
        for (j = i; j < ops.length; j++) {
          subexpr.push(ops[j]);

          if (ops[j] === '(') {
            nested++;
          } else if (ops[j] === ')') {
            nested--;
            if (nested === 0) {
              break;
            }
          }
        }

        operands.push(evaluate(subexpr, index + i));
        i = j + 1;
      } else {
        // might just be a number
        operands.push(evaluate(ops[i], index + i));
        i++;
      }
    }

    switch (op.typeID) {
      case 0:
        return operands.reduce((acc, next) => acc + next, 0);
      case 1:
        return operands.reduce((acc, next) => acc * next, 1);
      case 2:
        return Math.min(...operands);
      case 3:
        return Math.max(...operands);
      case 5:
        return operands[0] > operands[1] ? 1 : 0;
      case 6:
        return operands[0] < operands[1] ? 1 : 0;
      case 7:
        return operands[0] == operands[1] ? 1 : 0;
    }
  }
}

console.log(totalVersion, evaluate(args));
