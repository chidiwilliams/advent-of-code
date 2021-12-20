const fs = require('fs');
let input = fs.readFileSync(__dirname + '/input.txt').toString();

const algo = input.split('\n\n')[0];

const light = '#';
const dark = '.';

let image = input
  .split('\n\n')[1]
  .split('\n')
  .map((row) => row.split(''));

let padNext = dark;

for (let i = 0; i < 50; i++) {
  const result = enhance(image, padNext);
  image = result.image;
  padNext = result.paddingColor;
}

console.log(image.flat(1).filter((cell) => cell === light).length);

function enhance(image, padWith = dark) {
  // pad by 4 on all sides
  const paddedImage = Array.from({ length: image.length + 4 }, (row) =>
    Array.from({ length: image[0].length + 4 }, (col) => padWith),
  );
  image.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      paddedImage[rowIndex + 2][colIndex + 2] = cell;
    });
  });

  // console.log(paddedImage.map((row) => row.join('')).join('\n'));
  // console.log(paddedImage.length, paddedImage[0].length + '\n');

  const nextPad = algo[parseInt(padWith === dark ? '000000000' : '111111111', 2)];

  const nextImage = Array.from({ length: image.length + 4 }, (row) =>
    Array.from({ length: image[0].length + 4 }, (col) => nextPad),
  );
  nextImage.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (
        rowIndex > 0 &&
        colIndex > 0 &&
        rowIndex < nextImage.length - 1 &&
        colIndex < nextImage[0].length - 1
      ) {
        const target3x3 = slice2d(
          paddedImage,
          colIndex - 1,
          colIndex + 2,
          rowIndex - 1,
          rowIndex + 2,
        );
        const index = convertGridToDecimal(target3x3);

        nextImage[rowIndex][colIndex] = algo[index];
      }
    });
  });

  // console.log(nextImage.map((row) => row.join('')).join('\n'));
  // console.log('pad with', nextPad + '\n');
  return { image: nextImage, paddingColor: nextPad };
}

function slice2d(mat, x1, x2, y1, y2) {
  return mat.slice(y1, y2).map((row) => row.slice(x1, x2));
}

function convertGridToDecimal(grid) {
  const binary = grid
    .map((row) => row.map((cell) => (cell === light ? '1' : '0')).join(''))
    .join('');
  return parseInt(binary, 2) || 0;
}
