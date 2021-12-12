const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const paths = input.split('\n').map((row) => row.split('-'));

const graph = {};

paths.forEach(([start, end], i) => {
  graph[start] = graph[start] ? graph[start].concat(end) : [end];
  graph[end] = graph[end] ? graph[end].concat(start) : [start];
});

let numPaths = 0;

seekPath(graph);

function seekPath(graph, curr = 'start', smallVisited = ['start']) {
  if (curr === 'end') {
    numPaths++;
    return;
  }

  const next = graph[curr];

  next.forEach((node) => {
    // small cave
    if (node !== 'start' && node !== 'end' && node[0] > 'Z') {
      if (!smallVisited.includes(node)) {
        seekPath(graph, node, [...smallVisited, node]);
      }
    } else if (node !== 'start') {
      // large cave or 'end'
      seekPath(graph, node, smallVisited);
    }
  });
}

let numPaths2 = 0;

seekPath2(graph);

function seekPath2(graph, curr = 'start', smallVisited = ['start'], addedASmallCaveTwice = false) {
  if (curr === 'end') {
    numPaths2++;
    return;
  }

  const next = graph[curr];

  next.forEach((node) => {
    // small cave
    if (node !== 'start' && node !== 'end' && node[0] > 'Z') {
      // make two branches:
      // if no small cave has been added twice, add this one twice
      if (smallVisited.includes(node)) {
        if (!addedASmallCaveTwice) {
          seekPath2(graph, node, smallVisited, true);
        }
      } else {
        // if this node hasn't been added before
        seekPath2(graph, node, [...smallVisited, node], addedASmallCaveTwice);
      }
    } else if (node !== 'start') {
      // large cave or end
      seekPath2(graph, node, smallVisited, addedASmallCaveTwice);
    }
  });
}

console.log(graph, numPaths, numPaths2);
