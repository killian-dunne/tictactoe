import React from "react";


export default function Square(props) {
  let symbol = null;
  if (props.value === 'O') {
    symbol = <img src={require("./circle.png")} alt="O" className="o-format"/>;
  } else if (props.value === 'X') {
    symbol = <img src={require("./times.png")} alt="X" className="x-format"/>;
  }
  return (
    <div className={`square ${props.verticalRight}`} onClick={props.onClick} onChange={props.onChange}>
      {symbol}
    </div>
  );
}
