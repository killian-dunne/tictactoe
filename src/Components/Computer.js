function computerMove(squares, sym) {
  console.log(`Board in Computer is ${squares} with sym ${sym}`);

  let board = new Array(3);
  for (let t = 0; t < 3; t++) {
    board[t] = [squares[3 * t], squares[3 * t + 1], squares[3 * t + 2]];
  }

  let otherSym = getOtherSym(sym);

  let numMoves = countMoves(board, sym); // The number of moves already played
  if (numMoves === -1) {
    alert('There is a board error.');
    return -1;
  } else if (numMoves >= 9) {
    alert('Board error: the game should have ended!');
  }

  // Opening moves, assume 'X' always starts

  if (numMoves === 0) { // Playing 'X' (move #1)
    return 1;
  } else if (numMoves === 1) {// Playing 'O' (move #2)
    if (board[1][1] !== 'X') {
      return 5;
    } else {
      return 1;
    }
  } else if (numMoves === 2) { // Playing 'X' (move #3)
    let oIs = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === 'O') {
          oIs = i*board.length + j + 1;
        }
      }
      if (oIs === 2 || oIs === 3) {
        return 4;
      } else if (oIs === 4 || oIs === 5 || oIs === 7) {
        return 2;
      } else if (oIs === 6) {
        return 5;
      } else if (oIs === 8 || oIs === 9) {
        return 3;
      }
    }
  }

  // If a win exists

  // Execute win
  let compWin = findWin(board, sym);
  if (compWin > 0) { // Check if computer can win
    return compWin;

  } else {
    let stopWin = findWin(board, otherSym);
    if (stopWin > 0) { // Check if opponent can win
      return stopWin;
    }
  }

  // Check if there's a fork

  // Check if the computer can get a fork
  let compFork = findForks(board, sym);
  if (compFork > 0) {
    return compFork;
  } else { // Check if the person can get a fork
    let stopFork = findForks(board, sym, true);
    if (stopFork > 0) {
      return stopFork;
    }
  }

  // Check if there's a pair that doesn't allow a fork
  let pair = play2inaRow(board, sym)
  if (pair > 0) {
    return pair
  }

  // Play the centre square if it's free
  if (board[1][1] === null) {
    return 5;
  }

  // If a corner is occupied play the opposite corner
  let playOpposite = checkOpposite(board, sym);
  if (playOpposite > 0) {
    return playOpposite;
  }

  // Playing any empty corner
  let freeCorner = playaCorner(board, sym);
  if (freeCorner > 0) {
    return freeCorner;
  }
}

let playEdge = (board, sym) => {
  if (board[0][1] === null) {
    return 2;
  } else if (board[1][0] === null) {
    return 4;
  } else if (board[1][2] === null) {
    return 6;
  } else if (board[2][1] === null) {
    return 8;
  }
}

let checkOpposite = (board, sym) => {
  let otherSym = getOtherSym(sym);
  if        (board[2][2] === otherSym && board [0][0] === null) {
    return 1;
  } else if (board[2][0] === otherSym && board [0][2] === null) {
    return 3;
  } else if (board[0][2] === otherSym && board [2][0] === null) {
    return 7;
  } else if (board[0][0] === otherSym && board [2][2] === null) {
    return 9;
  }
  return -1;
}

let playaCorner = (board, sym) => {
  if (board[0][0] === null) {
    return 1;
  } else if (board[0][2] === null) {
    return 3;
  } else if (board[2][0] === null) {
    return 7;
  } else if (board[2][2] === null) {
    return 9;
  }
  return -1;
}

let findForks = (board, sym, multiple = false) => {
  // Check can we execute a fork
  const clone = (thing) => thing.map(item => Array.isArray(item) ? clone(item) : item);
  let copyBoard = clone(board);
  let otherSym = getOtherSym(sym);
  let forksFound = [];

  // Check can a fork be played by checking do any of the available squares
  // create a fork if filled

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (copyBoard[i][j] === null) {
        if (!multiple) {
          copyBoard[i][j] = sym;
          if (checkFork(copyBoard, sym)) {
            return board.length * i + j + 1;
          }
          copyBoard[i][j] = null;
        } else {
          copyBoard[i][j] = otherSym;
          if (checkFork(copyBoard, otherSym)) {
            forksFound.push(board.length * i + j + 1);
          }
          copyBoard[i][j] = null;
        }
      }
    }
  }

  let maximalForks = findMost(forksFound);
  if (maximalForks.length === 1) { // Prevent the unique square...
  // that prevents the most forks
    return maximalForks[0];
  } else if (maximalForks.length > 1) {
    for (let sq of maximalForks) { // Check if any of the forks
                                   // start your own attack
      if (checkCreate2inaRow(board, sym, sq)) {
        return sq;
      }
    }
    return maximalForks[0];
  }
  console.log('Found no forks');
  return -1;
}

let play2inaRow = (board, sym) => {
  let otherSym = getOtherSym(sym);
  console.log(`Board play2 ${board}`);

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (checkCreate2inaRow(board, sym, i * board.length + j + 1)) {
        if (findForks(board, otherSym, true) === -1) {
          return i * board.length + j + 1;
        }
      }
    }
  }
  console.log('No two-in-a-rows available');
  return -1;
}


let checkCreate2inaRow = (board, sym, sq) => {
  let i = Math.floor((sq - 1) / board.length);
  let j = (sq - 1) % board.length;

  if (board[i][j] !== null) {
    console.log('Error: Square is not empty!');
    return false;
  }
  const clone = (thing) => thing.map(item => Array.isArray(item) ? clone(item) : item);
  let copyBoard = clone(board);
  copyBoard[i][j] = sym;
  if (findWin(copyBoard, sym) > 0) {
    return true;
  }
  return false;
}

let firstAvailableSquare = (board) => {
  console.log('Error: returning first avialable square!');
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === null) {
        return i * board.length + j + 1;
      }
    }
  }
  console.log('No available squares!');
  return -1;
}

let checkFork = (board, sym) => {
  let i1 = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  let i2 = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1];
  let i3 = [1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 2];
  let i4 = [0, 0, 2, 0, 1, 0, 0, 1, 0, 0, 0, 0];
  let i5 = [2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1];
  let j1 = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
  let j2 = [2, 2, 2, 1, 2, 1, 2, 0, 1, 2, 2, 1];
  let j3 = [1, 1, 1, 1, 2, 0, 1, 1, 2, 0, 0, 2];
  let j4 = [1, 1, 0, 2, 1, 2, 1, 2, 2, 1, 1, 0];
  let j5 = [0, 2, 2, 2, 2, 0, 0, 2, 1, 0, 0, 2];

  let boards = applySymmetries(board);
  let position;
  for (position of boards) {
    for (let i = 0; i < i1.length; i++) {
      if (position[i1[i]][j1[i]] === sym &&
          position[i2[i]][j2[i]] === sym &&
          position[i3[i]][j3[i]] === sym &&
          position[i4[i]][j4[i]] === null &&
          position[i5[i]][j5[i]] === null) {
        return true;
      }
    }
  }
  return false;
}

let findMost = (arr) => { // A function that returns the square
                          // with executing the most forks

  let forkCount = {}; // Count the number of times a fork appears
  let maxNum = 0;
  let most = [];
  for (let i = 0; i < arr.length; i++) {
    if (forkCount[arr[i]] === undefined) {
      forkCount[arr[i]] = 0;
    }
    forkCount[arr[i]] += 1;
    if (forkCount[arr[i]] > maxNum) {
      maxNum = forkCount[arr[i]];
      most = [arr[i]];
    } else if (forkCount[arr[i]] === maxNum) {
      most.push(arr[i]);
    }
  }
  return most;
}

let countMoves = (board, sym) => {
  let numX = 0;
  let numO = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === 'X') {
        numX++;
      } else if (board[i][j] === 'O') {
        numO++;
      }
    }
  }
  if (sym === 'X' && numX !== numO) {
      return -1;
  } else if (sym === 'O' && numX !== numO + 1) {
    return -1;
  }
  return numX + numO;
}

function findWin(board, sym) {
  let boards = applySymmetries(board);
  let winSquare = -1;
  boards.forEach((symmetry, symmetryNo) => {
    let shiftedWinSquare = hasLine(symmetry, sym);
    if (shiftedWinSquare > 0) {
      winSquare = undoSymmetry(symmetryNo, shiftedWinSquare);
      return;
    }
  });
  return winSquare;

} // return the square in {1,...,9} to win else return -1

function applySymmetries(board) {
  let boards = new Array(8);
	for (let m = 0; m < 2; m++) { // two mirrors
		for (let r = 0; r < 4; r++) { // four rotations for each mirror
      boards[4*m + r] = board;
			board = rotateBoard(board);
		}
    board = reflectBoard(board);
	}
  return boards;
}

function undoSymmetry(idx, win) {
  let board = new Array(3);
  for (let j = 0; j < board.length; j++) {
    board[j] = new Array(3);
    for (let k = 0; k < board[j].length; k++) {
      if (j*board.length + k + 1 === win) {
        board[j][k] = 1;
      }
    }
  }

  let numRotations = (8 - idx) % 4; // Undo the mirrors and rotations
  for (let i = 0; i < numRotations; i++) {
    board = rotateBoard(board);
  }
  if (idx > 3) {
    board = reflectBoard(board);
  }

  for (let m = 0; m < board.length; m++) {
    for (let n = 0; n < board[0].length; n++) {
      if (board[m][n]) {
        return board.length*m + n + 1;
      }
    }
  }
  return -2; // In this case there's been an error
}

function hasLine(board, sym) {
  if        (board[0][0] === board[0][1] && board[0][0] === sym && board[0][2] === null) {
    return 3; // 1st
  } else if (board[0][0] === board[1][1] && board[0][0] === sym && board[2][2] === null) {
    return 9; // 2nd
  } else if (board[0][1] === board[1][1] && board[0][1] === sym && board[2][1] === null) {
    return 8; // 3rd
  } else if (board[0][0] === board[2][2] && board[0][0] === sym && board[1][1] === null) {
    return 5; // 4th
  } else if (board[0][0] === board[2][0] && board[0][0] === sym && board[1][0] === null) {
    return 4; // 5th
  } else if (board[0][1] === board[2][1] && board[0][1] === sym && board[1][1] === null) {
    return 5; // 6th
  }
  return -1;
}

function rotateBoard(board) {
	let rBoard = new Array(board.length);
	for (let i = 0; i < board.length; i++) {
    rBoard[i] = new Array(board[0].length);
		for (let j = 0; j < board[0].length; j++) {
      rBoard[i][j] = board[board.length-j-1][i];
		}
	}
  return rBoard;
}

function reflectBoard(board) {
  let rBoard = new Array(board.length);
  for (let i = 0; i < board.length; i++) {
    rBoard[i] = new Array(board[0].length);
    for (let j = 0; j < board[0].length; j++) {
      rBoard[i][j] = board[i][board.length-j-1];
    }
  }
  return rBoard;
}

let getOtherSym = (sym) => {
  if (sym === 'X') {
    return 'O';
  } else if (sym === 'O') {
    return 'X';
  }
  console.log('Error: Symbol not X or O');
  return null;
}


// an example of board:
/* [['X', null, null],
	['X', null, 'O'],
	[null, null, 'O']]
*/

export default computerMove;
