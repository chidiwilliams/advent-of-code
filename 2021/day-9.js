const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const heights = input.split('\n').map((row) => row.split('').map(Number));

let riskLevel = 0;

for (let i = 0; i < heights.length; i++) {
  for (let j = 0; j < heights[i].length; j++) {
    if (
      (j === 0 || heights[i][j] < heights[i][j - 1]) &&
      (j === heights[i].length - 1 || heights[i][j] < heights[i][j + 1]) &&
      (i === 0 || heights[i][j] < heights[i - 1][j]) &&
      (i === heights.length - 1 || heights[i][j] < heights[i + 1][j])
    ) {
      riskLevel += heights[i][j] + 1;
    }
  }
}

console.log({ riskLevel });

const basinSizes = [];
let allBasinLocations = [];

// Check locations for basins
for (let i = 0; i < heights.length; i++) {
  for (let j = 0; j < heights[i].length; j++) {
    if (
      // If the current location is not a 9
      heights[i][j] !== 9 &&
      // and is not already part of a basin we've checked
      !allBasinLocations.find((location) => location[0] === i && location[1] === j)
    ) {
      // Look for all the other locations in this basin starting from this location
      const basinLocations = [];
      seekBasin(heights, [i, j], basinLocations);

      basinSizes.push(basinLocations.length);
      allBasinLocations = allBasinLocations.concat(basinLocations);
    }
  }
}

basinSizes.sort((a, b) => b - a);
console.log(basinSizes[0] * basinSizes[1] * basinSizes[2]);

// Starting from the current location, recursively
// collect all the locations that form the basin
function seekBasin(heights, currentLocation, locations) {
  if (
    // Stop when we've gotten to a 9
    heights[currentLocation[0]][currentLocation[1]] === 9 ||
    // Or when we've checked this location before
    locations.find(
      (location) => location[0] === currentLocation[0] && location[1] === currentLocation[1],
    )
  ) {
    return;
  }

  locations.push(currentLocation);

  // Check each adjacent location
  for (let rowD = -1; rowD <= 1; rowD++) {
    for (let colD = -1; colD <= 1; colD++) {
      if (
        (rowD === 0 || colD === 0) && // exclude diagonals
        (rowD !== 0 || colD !== 0) && // exclude the current location itself
        // check if out of bounds
        heights[currentLocation[0] + rowD] !== undefined &&
        heights[currentLocation[0]][currentLocation[1] + colD] !== undefined
      ) {
        seekBasin(heights, [currentLocation[0] + rowD, currentLocation[1] + colD], locations);
      }
    }
  }
}
