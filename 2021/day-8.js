const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const entries = input
  .split('\n')
  .map((line) => line.split(' | '))
  .map((entry) => entry.map((section) => section.split(' ')));

{
  // Part 1
  const count = entries
    .map(([, line]) => line)
    .flat(1)
    .filter((outputValue) => [2, 3, 4, 7].includes(outputValue.length)).length;
  console.log(count);
}

{
  // Part 2
  let sum = 0;

  entries.forEach((entry) => {
    const patterns = entry[0];

    // All the possible values for each position of the cell
    //  0 --
    // 1 |  | 2
    //  3 --
    // 4 |  | 5
    //  6 --
    const possibleValuesForSegment = [
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // 0  --
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // 1 |
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // 2    |
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // 3  --
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // 4 |
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // 5    |
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // 6  --
    ];

    // Map of segment length to the segments for the
    // digits with unique number of segments.
    // e.g. if the segment length is 2, we definitely
    // know it should map to the segments 2 and 5
    const segmentLengthToSegments = {
      2: [2, 5],
      3: [0, 2, 5],
      4: [1, 2, 3, 5],
    };
    patterns.forEach((pattern) => {
      // If we know the segments this pattern appears on, we
      // constrain all the segments in the pattern to contain
      // only the values in the pattern
      const segments = segmentLengthToSegments[pattern.length];
      if (segments) {
        segments.forEach((segment) => {
          constrainPossibleValues(segment, (value) => pattern.includes(value));
        });
      }
    });

    // Segment combinations for each possible number
    const validNumberSegments = [
      [0, 2, 5, 6, 4, 1], // 0
      [2, 5], // 1
      [0, 2, 3, 4, 6], // 2
      [0, 2, 3, 5, 6], // 3
      [1, 3, 2, 5], // 4
      [0, 1, 3, 5, 6], // 5
      [0, 1, 3, 4, 5, 6], // 6
      [0, 2, 5], // 7
      [0, 1, 2, 3, 4, 5, 6], // 8
      [0, 1, 2, 3, 5, 6], // 9
    ];

    // Since we know all the valid ways a number can be constructed
    // from segments, we can constrain the segments to match the numbers.
    //
    // For each number combination, we find the possible ways to
    // combine the values to match the segments...
    validNumberSegments.forEach((numberSegments) => {
      const possibleWays = [];
      matchNumberSegments(possibleValuesForSegment, numberSegments, 0, possibleWays);

      // Then we can constrain each number segment
      // by the values we know can match it
      for (let i = 0; i < numberSegments.length; i++) {
        // Values which the segment in position `i` can have
        const possibleValues = new Set(possibleWays.map((possibleWay) => possibleWay[i]));
        constrainPossibleValues(numberSegments[i], (value) => possibleValues.has(value));
      }
    });

    // Next, we can constrain by the patterns we have.
    //
    // For each given pattern, we check each number we can form with
    // that pattern, then we constrain the possible values by that
    // combination of patterns and number segments
    patterns.forEach((pattern) => {
      validNumberSegments
        .filter((numberSegments) => numberSegments.length === pattern.length)
        .forEach((numberSegments) => {
          // Check for all possible ways we can make
          // the pattern match the number segment
          const possibleWays = [];
          matchPatternAndNumberSegments(pattern.split(''), numberSegments, possibleWays, 0, '');

          if (possibleWays.length) {
            for (let i = 0; i < numberSegments.length; i++) {
              // Values which the segment in position `i` can have
              const possibleValues = new Set(possibleWays.map((possibleWay) => possibleWay[i]));
              constrainPossibleValues(numberSegments[i], (value) => possibleValues.has(value));
            }
          }
        });
    });

    const valueToSegment = possibleValuesForSegment.reduce(
      (acc, currValues, i) => ({ ...acc, [currValues[0]]: i }),
      {},
    );

    const outputPatterns = entry[1];
    let result = '';

    outputPatterns.forEach((pattern, i) => {
      const patternSegments = pattern.split('').map((value) => valueToSegment[value]);

      // Look through all the numbers to find the
      // one with segments that match the pattern
      const validNumber = validNumberSegments
        // Store the actual number (represented by its index, i)
        .map((numberSegments, i) => [numberSegments, i])
        .find(
          ([numberSegments]) =>
            numberSegments.length === patternSegments.length &&
            numberSegments.every((segment) => patternSegments.includes(segment)),
        )[1]; // return the segment's index

      result += String(validNumber);
    });

    // Sum up the result
    sum += Number(result);

    // Constrains the possible values of a segment based on filterFn
    function constrainPossibleValues(segment, filterFn) {
      const nextPossibleValues = possibleValuesForSegment[segment].filter(filterFn);

      if (nextPossibleValues.length < possibleValuesForSegment[segment].length) {
        possibleValuesForSegment[segment] = nextPossibleValues;

        // If the segment has only one possible value left, we
        // can safely remove the value from the other segments
        if (possibleValuesForSegment[segment].length === 1) {
          possibleValuesForSegment.forEach((_, i) => {
            if (i !== segment) {
              constrainPossibleValues(i, (value) => value !== possibleValuesForSegment[segment][0]);
            }
          });
        }
      }
    }

    function matchPatternAndNumberSegments(
      pattern,
      numberSegments,
      possibleWays,
      currSegmentIndex,
      currWay,
    ) {
      const segment = numberSegments[currSegmentIndex];
      if (segment === undefined) {
        possibleWays.push(currWay);
        return;
      }

      const possibleValues = possibleValuesForSegment[segment];
      possibleValues.forEach((possibleValue) => {
        if (!pattern.includes(possibleValue)) {
          return;
        }

        matchPatternAndNumberSegments(
          pattern.filter((patternValue) => patternValue !== possibleValue),
          numberSegments,
          possibleWays,
          currSegmentIndex + 1,
          currWay + possibleValue,
        );
      });
    }

    function matchNumberSegments(
      possibleValuesForSegment,
      numberSegments,
      currSegmentIndex,
      possibleWays,
      currentWay = '',
    ) {
      const nextSegment = numberSegments[currSegmentIndex];
      if (nextSegment === undefined) {
        possibleWays.push(currentWay);
        return;
      }

      // Remove the current way frmo the possible value of the next segment
      const nextPossibleValuesForSegment = {
        ...possibleValuesForSegment,
        [nextSegment]: possibleValuesForSegment[nextSegment].filter(
          (value) => !currentWay.includes(value),
        ),
      };

      for (let i = 0; i < nextPossibleValuesForSegment[nextSegment].length; i++) {
        matchNumberSegments(
          possibleValuesForSegment,
          numberSegments,
          currSegmentIndex + 1,
          possibleWays,
          currentWay + nextPossibleValuesForSegment[nextSegment][i],
        );
      }
    }
  });

  console.log(sum);
}
