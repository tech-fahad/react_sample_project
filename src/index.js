import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './index.css';


function Square (props){
      return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {

    renderSquare(i, row, column) {
      return <Square value={this.props.squares[i]}
      onClick={() => this.props.onClick(i,row, column)} />;
    }
  
    render() {
      
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0,1,1)}
            {this.renderSquare(1,1,2)}
            {this.renderSquare(2,1,3)}
          </div>
          <div className="board-row">
            {this.renderSquare(3,2,1)}
            {this.renderSquare(4,2,2)}
            {this.renderSquare(5,2,3)}
          </div>
          <div className="board-row">
            {this.renderSquare(6,3,1)}
            {this.renderSquare(7,3,2)}
            {this.renderSquare(8,3,3)}
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
        location: [],
        stepNumber: 0,
        xIsNext: true,
      }
    }
    handleClick(i, row, column) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      let location = this.state.location;
      location.push({row: row, column: column});
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        location: location,
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        row: row,
        column: column,
      });
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        let locationIndex = move ? move - 1 : move;
        console.log(move);
        const row = this.state.location.length ? this.state.location[locationIndex].row : null;
        const column = this.state.location.length ? this.state.location[locationIndex].column : null;
        const desc = move ?
          'Go to move #' + move + '(' + row + ',' + column + ')':
          'Go to game start';

        return (
          <li key={move} className={"current"}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
      
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} 
            onClick={(i,row, column) => this.handleClick(i, row, column)} />
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


  