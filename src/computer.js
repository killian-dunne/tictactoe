function computerMove(board, sym) {
	if(testWin(board, sym)) {

	}
}

function testWin(board, sym) {

}

function applySymmetries(board) {
	for (let m = 0; m < 2; m++) { // two mirrors
		for (let r = 0; r < 4; r++) { // four rotations for each mirror
			board = rotateBoard(board);
		}
	}	
}


export default function rotateBoard(board) {
	let rBoard = new Array(board.length);
	for (let i = 0; i < board.length; i++) {
    rBoard[i] = new Array(board[0].length);
		for (let j = 0; j < board[0].length; j++) {
      rBoard[i][j] = board[board.length-j-1][ i];
		}
	}
  return rBoard;
}

// an example of board:
/* [['X', null, null],
	['X', null, 'O'],
	[null, null, 'O']]
*/

