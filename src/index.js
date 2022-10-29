import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

function Square(props) {
  return (
    <button
      onClick={props.onClick}
      className={`square ${
        props.winningCombo.includes(props.field) ? "won" : ""
      }`}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        field={i}
        winningCombo={this.props.winningCombo}
      />
    );
  }

  render() {
    let cellCount = 0;
    const rows = [];
    for (let row = 0; row < 3; row++) {
      const columns = [];
      rows.push(
        <div className="board-row" key={row}>
          {columns}
        </div>
      );
      for (let colum = 0; colum < 3; colum++) {
        columns.push(this.renderSquare(cellCount));
        cellCount += 1;
      }
    }

    return <div>{rows}</div>;
  }
}

function Message(props) {
  if (props.stepNumber === 9 && props.result === null) {
    return (<h3 className="message">The game is a draw</h3>);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      sortDesc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          changedCell: i,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);
    let winner;
    let winningCombo = [];
    if (result) {
      winner = result[0];
      winningCombo = result[1];
    }
    let moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " " + getCoordinates(step)
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={`${move === this.state.stepNumber ? "active" : ""}`}
          >
            {desc}
          </button>
        </li>
      );
    });

    if (this.state.sortDesc) {
      moves = moves.reverse();
    }

    const status = winner
      ? "Winner: " + winner
      : "Next player: " + (this.state.xIsNext ? "X" : "O");

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningCombo={winningCombo}
          />
        </div>

        <Message result={result} stepNumber={this.state.stepNumber}/>

        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => {
              this.setState({
                sortDesc: !this.state.sortDesc,
              });
            }}
          >
            sort history
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function getCoordinates(step) {
  const col = step.changedCell % 3;
  const row = Math.floor(step.changedCell / 3);
  return `(col${col},row${row})`;
}

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
      console.log(lines[i]);
      return [squares[a], lines[i]];
    }
  }
  return null;
}
