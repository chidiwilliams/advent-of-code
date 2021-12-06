const fs = require('fs');
const input = fs.readFileSync(__dirname + '/input.txt').toString();

const data = input.split('\n');

const numbers = data[0].split(',').map(Number);

const boards = data
  .slice(2)
  .join('\n')
  .split('\n\n')
  .map((board) =>
    board.split('\n').map((row) =>
      row
        .split(' ')
        .filter((cell) => cell != '')
        .map(Number)
        .map((cell) => ({ value: cell, marked: false })),
    ),
  );

{
  // Part 1
  let correctBoard;
  let winningNumber;

  root: for (let i = 0; i < numbers.length; i++) {
    const inputNumber = numbers[i];

    for (let j = 0; j < boards.length; j++) {
      const board = boards[j];

      markBoard(board, inputNumber);
      if (checkFilled(board)) {
        correctBoard = board;
        winningNumber = inputNumber;
        break root;
      }
    }
  }

  console.log(getBoardScore(correctBoard, winningNumber));
}

{
  // Part 2
  let correctBoard;
  let winningNumber;
  let boardwins = new Set();

  for (let i = 0; i < numbers.length; i++) {
    const inputNumber = numbers[i];

    for (let j = 0; j < boards.length; j++) {
      if (!boardwins.has(j)) {
        const board = boards[j];

        markBoard(board, inputNumber);
        if (checkFilled(board)) {
          correctBoard = board;
          winningNumber = inputNumber;
          boardwins.add(j);
        }
      }
    }
  }

  console.log(getBoardScore(correctBoard, winningNumber));
}

function markBoard(board, number) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].value === number) {
        board[i][j].marked = true;
      }
    }
  }
}

function checkFilled(board) {
  // check h
  for (let i = 0; i < board.length; i++) {
    let rowMarked = true;
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j].marked) {
        rowMarked = false;
      }
    }

    if (rowMarked) {
      return true;
    }
  }

  // check v
  // col
  for (let i = 0; i < board[0].length; i++) {
    let colMarked = true;

    for (let j = 0; j < board.length; j++) {
      if (!board[j][i].marked) {
        colMarked = false;
      }
    }

    if (colMarked) {
      return true;
    }
  }

  return false;
}

function getBoardScore(board, winningNumber) {
  let sumUnmarked = 0;

  board.forEach((row) => {
    row.forEach((cell) => {
      if (!cell.marked) {
        sumUnmarked += cell.value;
      }
    });
  });

  return sumUnmarked * winningNumber;
}
