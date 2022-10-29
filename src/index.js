import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className={props.highlight} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (<Square
            highlight={this.props.highlight[i]}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />);
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
            xIsNext: true,
            moveLocation: Array(9).fill(null),
        };
    }

    getMoveLocation(i) {
        const arrIndices = ['(1, 1)', '(2, 1)', '(3, 1)', '(1, 2)', '(2, 2)', '(3, 2)', '(1, 3)', '(2, 3)', '(3, 3)'];
        const arr = this.state.moveLocation.slice();
        arr[this.state.stepNumber] = arrIndices[i];
        return arr;
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) !== null || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            moveLocation: this.getMoveLocation(i),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            highlight: Array(9).fill('square'),
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares) !== null;
        const combo = highlightWinningSquares(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + ' ' + this.state.moveLocation[move - 1] : 'Go to game start';
            const el = move === this.state.stepNumber ? <b>{desc}</b> : <>{desc}</>;

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {el}
                    </button>
                </li>
            );
        })

        let status, highlightArr = Array(9).fill('square');
        if (winner) {
            status = 'Winner: ' + winner;

            highlightArr[combo[0]] = 'square highlightSquare';
            highlightArr[combo[1]] = 'square highlightSquare';
            highlightArr[combo[2]] = 'square highlightSquare';
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        highlight={highlightArr}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    console.log("calculate winner");
    const line = highlightWinningSquares(squares);
    console.log("win:" + line);
    return line ? line[0] : null;
}
function highlightWinningSquares(squares) {
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
            return lines[i];
        }
    }
    return null;
}
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
