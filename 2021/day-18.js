const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt').toString();

const numbers = input.split('\n').map(JSON.parse);
const magnitudeSum = magnitude(numbers.reduce(add));

console.log(magnitudeSum, getLargestMagnitudeOfSums(input.split('\n').map(JSON.parse)));

function getLargestMagnitudeOfSums(numbers) {
  let maxMag = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i !== j) {
        // deep copy arrays before summing!
        const magSum = magnitude(
          add(JSON.parse(JSON.stringify(numbers[i])), JSON.parse(JSON.stringify(numbers[j]))),
        );
        maxMag = Math.max(maxMag, magSum);
      }
    }
  }

  return maxMag;
}

function magnitude(val) {
  if (typeof val === 'number') {
    return val;
  }

  return 3 * magnitude(val[0]) + 2 * magnitude(val[1]);
}

function add(a, b) {
  const result = [a, b];

  while (true) {
    if (explode(result)) {
      continue;
    }

    if (split(result)) {
      continue;
    }

    break;
  }

  return result;
}

function split(val) {
  const nums = [];
  getSplittablePair(val, nums);
  if (nums.length === 0) {
    return false;
  }

  const index = nums[0].split('').map(Number);

  let arr = val;
  for (let i = 0; i < index.length - 1; i++) {
    arr = arr[index[i]];
  }

  arr[index[index.length - 1]] = [
    Math.floor(arr[index[index.length - 1]] / 2),
    Math.ceil(arr[index[index.length - 1]] / 2),
  ];
  return true;
}

function getSplittablePair(val, nums, index = '') {
  for (let i = 0; i < val.length; i++) {
    const element = val[i];
    if (typeof element === 'number') {
      if (element >= 10) {
        nums.push(index + i);
      }
    } else {
      getSplittablePair(element, nums, index + i);
    }
  }
}

function explode(val) {
  const ePair = getExplodablePair(val);
  if (ePair === undefined) {
    return false;
  }

  const { val: pair, index, depth } = ePair;
  if (depth < 4) {
    return false;
  }

  // Update the left hand side
  let leftIndex = index.split('').map(Number);
  while (leftIndex.length > 0) {
    // get the value to the left of this index
    const l = +leftIndex[leftIndex.length - 1] - 1;
    leftIndex = leftIndex.slice(0, leftIndex.length - 1).concat(l);

    let arr = val;
    for (let i = 0; i < leftIndex.length - 1; i++) {
      arr = arr[leftIndex[i]];
    }

    if (arr[leftIndex[leftIndex.length - 1]] === undefined) {
      leftIndex.pop();
      continue;
    } else {
      if (typeof arr[leftIndex[leftIndex.length - 1]] === 'number') {
        arr[leftIndex[leftIndex.length - 1]] += pair[0];
      } else {
        let arrToChange = arr[leftIndex[leftIndex.length - 1]];
        while (true) {
          if (typeof arrToChange[arrToChange.length - 1] === 'number') {
            arrToChange[arrToChange.length - 1] += pair[0];
            break;
          }
          arrToChange = arrToChange[arrToChange.length - 1];
        }
      }

      break;
    }
  }

  // Update the right hand side
  let rightIndex = index.split('').map(Number);
  while (rightIndex.length > 0) {
    // get the value to the right of this index
    const l = +rightIndex[rightIndex.length - 1] + 1;
    rightIndex = rightIndex.slice(0, rightIndex.length - 1).concat(l);

    let arr = val;
    for (let i = 0; i < rightIndex.length - 1; i++) {
      arr = arr[rightIndex[i]];
    }

    if (arr[rightIndex[rightIndex.length - 1]] === undefined) {
      rightIndex.pop();
      continue;
    } else {
      if (typeof arr[rightIndex[rightIndex.length - 1]] === 'number') {
        arr[rightIndex[rightIndex.length - 1]] += pair[1];
      } else {
        let arrToChange = arr[rightIndex[rightIndex.length - 1]];
        while (true) {
          if (typeof arrToChange[0] === 'number') {
            arrToChange[0] += pair[1];
            break;
          }
          arrToChange = arrToChange[0];
        }
      }
      break;
    }
  }

  // Replace pair with 0
  let pairIndex = index.split('').map(Number);
  let arr = val;
  for (let i = 0; i < pairIndex.length - 1; i++) {
    arr = arr[pairIndex[i]];
  }
  arr[pairIndex[pairIndex.length - 1]] = 0;

  return true;
}

function getExplodablePair(val, depth = 0, index = '') {
  let hasNested = false;
  for (const element of val) {
    if (typeof element !== 'number') {
      hasNested = true;
    }
  }

  if (hasNested) {
    let maxChildDepth = Number.NEGATIVE_INFINITY;
    let maxChildIndex;
    let maxChildVal;

    for (let i = 0; i < val.length; i++) {
      const element = val[i];
      if (typeof element !== 'number') {
        const {
          depth: childDepth,
          index: childIndex,
          val: childVal,
        } = getExplodablePair(element, depth + 1, index + i);
        if (childDepth > maxChildDepth) {
          maxChildDepth = childDepth;
          maxChildIndex = childIndex;
          maxChildVal = childVal;
        }
      }
    }

    return { depth: maxChildDepth, index: maxChildIndex, val: maxChildVal };
  } else {
    return { depth, index, val };
  }
}
