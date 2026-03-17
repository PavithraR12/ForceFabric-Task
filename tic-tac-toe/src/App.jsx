import { useState } from "react";

function Square({ value, onClick, isWinning }) {
  return (
    <button
      onClick={onClick}
      className={`square ${value ? 'filled' : ''} ${isWinning ? 'winning' : ''} ${value === 'X' ? 'player-x' : ''} ${value === 'O' ? 'player-o' : ''}`}
    >
      {value}
    </button>
  );
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
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

export default function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line || [];
  const isDraw = !winner && squares.every(square => square !== null);

  function handleClick(i) {
    if (squares[i] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    const newWinnerInfo = calculateWinner(nextSquares);
    if (newWinnerInfo) {
      setTimeout(() => {
        setScores(prev => ({
          ...prev,
          [newWinnerInfo.winner]: prev[newWinnerInfo.winner] + 1
        }));
      }, 500);
    } else if (nextSquares.every(square => square !== null)) {
      setTimeout(() => {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      }, 500);
    }
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetScores() {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  }

  let status;
  let statusIcon;
  if (winner) {
    status = `Player ${winner} Wins!`;
    statusIcon = "🏆";
  } else if (isDraw) {
    status = "It's a Draw!";
    statusIcon = "🤝";
  } else {
    status = `Player ${xIsNext ? "X" : "O"}'s Turn`;
    statusIcon = xIsNext ? "❌" : "⭕";
  }

  return (
    <div className="game-container">
      <div className="background-effects">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
        <div className="glow glow-3"></div>
      </div>

      <div className="game-content">
        <div className="game-header">
          <h1 className="game-title">
            <span className="title-text">Tic Tac Toe</span>
            <span className="title-underline"></span>
          </h1>
          <p className="subtitle">Classic Strategy Game</p>
        </div>

        <div className="scoreboard">
          <div className="score-card player-x-card">
            <div className="score-icon">❌</div>
            <div className="score-label">Player X</div>
            <div className="score-value">{scores.X}</div>
          </div>
          <div className="score-card draws-card">
            <div className="score-icon">🤝</div>
            <div className="score-label">Draws</div>
            <div className="score-value">{scores.draws}</div>
          </div>
          <div className="score-card player-o-card">
            <div className="score-icon">⭕</div>
            <div className="score-label">Player O</div>
            <div className="score-value">{scores.O}</div>
          </div>
        </div>

        <div className="status-banner">
          <span className="status-icon">{statusIcon}</span>
          <span className="status-text">{status}</span>
        </div>

        <div className="board-container">
          <div className="board">
            {[0, 1, 2].map(row => (
              <div key={row} className="board-row">
                {[0, 1, 2].map(col => {
                  const index = row * 3 + col;
                  return (
                    <Square
                      key={index}
                      value={squares[index]}
                      onClick={() => handleClick(index)}
                      isWinning={winningLine.includes(index)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-secondary" onClick={resetGame}>
            <span className="btn-icon">🔄</span>
            <span>New Game</span>
          </button>
          <button className="btn btn-primary" onClick={resetScores}>
            <span className="btn-icon">🗑️</span>
            <span>Reset Scores</span>
          </button>
        </div>
      </div>
    </div>
  );
}