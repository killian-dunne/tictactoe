import React from "react";
import Square from "./Square";
import "./Board.css";

class Board extends React.Component {
  renderSquare(i) {
    let verticalRight = "";
    if (i % 3 === 0 || i % 3 === 1) {
      verticalRight = "vertical-right";
    }
    console.log(i % 3);
    console.log(verticalRight);
    return (<Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      onChange={() => this.props.onChange(i)}
      verticalRight={verticalRight}/>);
  }

  render() {
    return (
      <div className="board-div">
        <div className="board-row horizontal-below">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>

        <div className="board-row horizontal-below">
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

export default Board;
