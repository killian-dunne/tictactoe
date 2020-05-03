import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import computerMove from './Components/Computer.js';
import Board from './Components/Board';
import calculateWinner from './util/calculateWinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faUser } from '@fortawesome/free-solid-svg-icons';


// 'X' always starts

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      computerSym: false, // false means the computer is not playing
      showSetup: "",
      iconSize: window.innerWidth < 750 ? "lg" : "5x"
    };
  }

  handleClick = (i, computerSym=false) => {
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
    this.setState(prevState => ({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      computerSym: prevState.computerSym,
    }));
  }

  jumpTo = (step, computerSym) => {
    this.setState((prevState, props) => ({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      computerSym: computerSym,
      history: prevState.history.slice(0, step + 1),
    }));
  }

  handleComputerSetup = (sym) => {
    this.jumpTo(0, sym);
    this.render();
  }

  toggleSetup = (e) => {
    // Treatment of FontAwesomeIcon className error
    let probablyIcon = false;
    if (e.target.tagName==="path" || e.target.tagName==="svg") {
      probablyIcon = true;
    }
    if (!(e.target.parentElement.parentElement.className.includes("game-option")
      && probablyIcon)) { // Then is(?) icon.
      if (e.target.className.includes("clickable")) {
        this.setState({
          showSetup: this.state.showSetup ? "" : "hide"
        });
      }
    }
  }

  compTurn = () => { // Checks if it's the computers go and triggers the move if so
    let sym = this.state.computerSym;
    if ((sym === 'X' && this.state.xIsNext)
      || (sym === 'O' && !this.state.xIsNext)){
        let i = computerMove(this.state.history[this.state.history.length - 1].squares, sym);
        this.handleClick(i-1, sym);
        return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (this.state.stepNumber < 9) {
      this.compTurn();
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleIconSize);
  }

  handleIconSize = () => {
    this.setState({
      iconSize: window.innerWidth < 750 ? "lg" : "5x"
    });
  }

  undoMove = () => {
    let sN = this.state.stepNumber;
    if (sN === 1) {
      this.jumpTo(0, this.state.computerSym);
    } else if (sN <= 9){
      if (this.state.computerSym) {
        this.jumpTo(sN - 2, this.state.computerSym);
      } else {
        this.jumpTo(sN - 1, this.state.computerSym);
      }
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner === 'X' || winner === 'O') {
      status = 'Winner: ' + winner;
    } else if (winner === 'draw') {
      status = 'Draw Game!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    let showUndo = "hide";
    if (this.state.stepNumber > 0 && this.state.stepNumber <= 9) {
      showUndo = "";
    }
    return (
      <div className="game">
        <div className="title-section">
          <h1 className="title">Tic Tac Toe!</h1>
        </div>
        <div className="game-section">
          <div className="background-box">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>

            <div className="vl"></div>

            <div className="game-info">
              <div className="game-status">{status}</div>
              <button className={`info-button ${showUndo}`} onClick={this.undoMove}>Undo</button>
              <button onClick={this.toggleSetup} className="clickable info-button">New game</button>
            </div>
          </div>
        </div>

        {/* Modal stuff */}
        <div className={`modal clickable ${this.state.showSetup}`} onClick={this.toggleSetup}>
          <div className="game-setup">
            <span onClick={this.toggleSetup} className="topright-x clickable">&times;</span>
            <p className="hello-text"> Select game mode: </p>
            <div className="options">
              <div className="game-option">
                <FontAwesomeIcon icon={faUser} size={this.state.iconSize} />
                <button onClick={() => this.jumpTo(0, false)} className="pad-left clickable setup-button">Against a friend</button>
              </div>
              <div className="game-option">
                <FontAwesomeIcon icon={faLaptopCode} size={this.state.iconSize}  />
                <button onClick={() => this.handleComputerSetup('O')} className="clickable setup-button">X against the computer</button>
              </div>
              <div className="game-option">
                <FontAwesomeIcon icon={faLaptopCode} size={this.state.iconSize} />
                <button onClick={() => this.handleComputerSetup('X')} className="clickable setup-button">O against the computer</button>
              </div>
            </div>
          </div>
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
