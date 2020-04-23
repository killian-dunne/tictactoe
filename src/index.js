import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import computerMove from './computer.js';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>);
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}/>);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      player1IsNext: true,
      computerPlaying: false,
    };
  }

  handleClick(i, computerSym = 'O', compTurn=false) {
    console.log('i: ' + i.toString());
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    if (this.state.stepNumber % 2 === 0) {
      squares[i] = 'X';
    } else {
      squares[i] = 'O';
    }
    console.log('handleClick squares:' + squares);
    console.log('before player1IsNext: ' + this.state.player1IsNext);
    this.setState(prevState => ({
      history: history.concat([{
        squares: squares,
      }]), 
      stepNumber: history.length,
      player1IsNext: !this.state.player1IsNext,
      computerPlaying: prevState.computerPlaying,
    }));
    console.log('player1IsNext: ' + this.state.player1IsNext);
    console.log('handleClick history:' + history.length + this.state.history[0]);
    console.log(this.state.history);
    compTurn = !compTurn;

    if (this.state.computerPlaying && compTurn) { // Not updating for some reason
      console.log('in if statement');
      let theMove = computerMove(squares, computerSym);
      console.log(theMove);
      this.handleClick(theMove-1, computerSym, true);
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step, 
      player1IsNext: (step % 2) === 0,
    });
  }

  turnOnComputer(sym) {
    this.setState({
      computerPlaying: true,
    });

    console.log('is the computer playing?');
    console.log(this.state.computerPlaying);
    console.log(sym);
    if (sym === 'X') {
      let i = computerMove(this.history[this.history.length - 1].squares, sym);
      this.handleClick(i, sym);
    } 
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 
      'Go to move #' + move :
      'Start new game';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.player1IsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div>
          <button onClick={() => this.jumpTo(0)}>Play against a friend</button><br/>
          <button onClick={() => this.turnOnComputer('O')}>Play as X against the computer</button>
          <button onClick={() => this.turnOnComputer('X')}>Play as O against computer</button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8],
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6], 
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}