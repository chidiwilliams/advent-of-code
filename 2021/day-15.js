const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const paths = input.split('\n').map((row) => row.split('').map(Number));

{
  let nRecurs = 0;
  let minRisk = Number.POSITIVE_INFINITY;

  const minRiskAtPosition = Array.from({ length: paths.length * 5 }, () =>
    Array.from({ length: paths[0].length * 5 }, () => Number.POSITIVE_INFINITY),
  );

  function seekPath(paths, currentRow, currentCol, totalRisk) {
    nRecurs++;

    if (
      (minRiskAtPosition[currentRow][currentCol - 1] !== undefined &&
        minRiskAtPosition[currentRow][currentCol - 1] + paths[currentRow][currentCol] <
          totalRisk) ||
      (minRiskAtPosition[currentRow][currentCol + 1] !== undefined &&
        minRiskAtPosition[currentRow][currentCol + 1] + paths[currentRow][currentCol] <
          totalRisk) ||
      (minRiskAtPosition[currentRow - 1] !== undefined &&
        minRiskAtPosition[currentRow - 1][currentCol] !== undefined &&
        minRiskAtPosition[currentRow - 1][currentCol] + paths[currentRow][currentCol] <
          totalRisk) ||
      (minRiskAtPosition[currentRow + 1] !== undefined &&
        minRiskAtPosition[currentRow + 1][currentCol] !== undefined &&
        minRiskAtPosition[currentRow + 1][currentCol] + paths[currentRow][currentCol] <
          totalRisk) ||
      totalRisk >= minRiskAtPosition[currentRow][currentCol] ||
      totalRisk + 1 * (paths.length - currentRow + (paths[0].length - currentCol)) > minRisk
    ) {
      return;
    }

    minRiskAtPosition[currentRow][currentCol] = totalRisk;

    if (currentRow === paths.length - 1 && currentCol === paths[0].length - 1) {
      if (totalRisk < minRisk) {
        minRisk = totalRisk;
        return;
      }
    }

    // down
    if (currentRow < paths.length - 1) {
      seekPath(paths, currentRow + 1, currentCol, totalRisk + paths[currentRow + 1][currentCol]);
    }

    // right
    if (currentCol < paths[0].length - 1) {
      seekPath(paths, currentRow, currentCol + 1, totalRisk + paths[currentRow][currentCol + 1]);
    }

    // up
    if (currentRow > 1) {
      seekPath(paths, currentRow - 1, currentCol, totalRisk + paths[currentRow - 1][currentCol]);
    }

    // left
    if (currentCol > 1) {
      seekPath(paths, currentRow, currentCol - 1, totalRisk + paths[currentRow][currentCol - 1]);
    }
  }

  seekPath(paths, 0, 0, 0);

  console.log({ minRisk, nRecurs });
}

{
  let nRecurs = 0;
  let minRisk = Number.POSITIVE_INFINITY;

  const minRiskAtPosition = Array.from({ length: paths.length * 5 }, () =>
    Array.from({ length: paths[0].length * 5 }, () => Number.POSITIVE_INFINITY),
  );

  function seekPath2(paths, currentRow, currentCol, totalRisk) {
    nRecurs++;

    if (
      (minRiskAtPosition[currentRow][currentCol - 1] !== undefined &&
        minRiskAtPosition[currentRow][currentCol - 1] + get(currentRow, currentCol) < totalRisk) ||
      (minRiskAtPosition[currentRow][currentCol + 1] !== undefined &&
        minRiskAtPosition[currentRow][currentCol + 1] + get(currentRow, currentCol) < totalRisk) ||
      (minRiskAtPosition[currentRow - 1] !== undefined &&
        minRiskAtPosition[currentRow - 1][currentCol] !== undefined &&
        minRiskAtPosition[currentRow - 1][currentCol] + get(currentRow, currentCol) < totalRisk) ||
      (minRiskAtPosition[currentRow + 1] !== undefined &&
        minRiskAtPosition[currentRow + 1][currentCol] !== undefined &&
        minRiskAtPosition[currentRow + 1][currentCol] + get(currentRow, currentCol) < totalRisk) ||
      totalRisk >= minRiskAtPosition[currentRow][currentCol] ||
      totalRisk + 1 * (paths.length - currentRow + (paths[0].length - currentCol)) > minRisk
    ) {
      return;
    }

    minRiskAtPosition[currentRow][currentCol] = totalRisk;

    if (currentRow === paths.length * 5 - 1 && currentCol === paths[0].length * 5 - 1) {
      if (totalRisk < minRisk) {
        minRisk = totalRisk;
        return;
      }
    }

    // down
    if (currentRow < paths.length * 5 - 1) {
      seekPath2(paths, currentRow + 1, currentCol, totalRisk + get(currentRow + 1, currentCol));
    }

    // right
    if (currentCol < paths[0].length * 5 - 1) {
      seekPath2(paths, currentRow, currentCol + 1, totalRisk + get(currentRow, currentCol + 1));
    }

    // up
    if (currentRow > 1) {
      seekPath2(paths, currentRow - 1, currentCol, totalRisk + get(currentRow - 1, currentCol));
    }

    // left
    if (currentCol > 1) {
      seekPath2(paths, currentRow, currentCol - 1, totalRisk + get(currentRow, currentCol - 1));
    }
  }

  seekPath2(paths, 0, 0, 0);

  console.log({ minRisk, nRecurs });

  function get(row, col) {
    const colIndex = col % paths.length;
    const rowIndex = row % paths.length;

    if (
      paths[rowIndex] === undefined ||
      paths[rowIndex][colIndex] === undefined ||
      row > 5 * paths.length ||
      col > 5 * paths[0].length
    ) {
      return undefined;
    }

    const val =
      paths[rowIndex][colIndex] + parseInt(col / paths.length) + parseInt(row / paths.length);
    return val > 9 ? val - 9 : val;
  }
}
