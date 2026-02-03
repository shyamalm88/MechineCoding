import { useState } from "react";

export default function TicTacToe({ size = 5 }) {
  const n = size;

  const createBoard = () =>
    Array.from({ length: n }, () => Array(n).fill(null));

  const [board, setBoard] = useState(createBoard);
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [moves, setMoves] = useState(0);


  const count = (board, r, c, dr, dc, player) => {
  let i = r + dr;
  let j = c + dc;
  let cnt = 0;

  while (
    i >= 0 &&
    j >= 0 &&
    i < board.length &&
    j < board.length &&
    board[i][j] === player
  ) {
    cnt++;
    i += dr;
    j += dc;
  }

  return cnt;
};

  const checkWin = (board, row, col, player) => {
    for (let [dr, dc] of directions) {
    const total =
      1 +
      count(board, r, c, dr, dc, player) +
      count(board, r, c, -dr, -dc, player);

    if (total >= board.length) return true;
  }
  return false;
  };

  const handleClick = (r, c) => {
    if (board[r][c] || winner) return;

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = player;

    if (checkWin(newBoard, r, c, player)) {
      setWinner(player);
    } else if (moves + 1 === n * n) {
      setWinner("Draw");
    } else {
      setPlayer(player === "X" ? "O" : "X");
    }

    setBoard(newBoard);
    setMoves(moves + 1);
  };

  const reset = () => {
    setBoard(createBoard());
    setPlayer("X");
    setWinner(null);
    setMoves(0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>
        {winner
          ? winner === "Draw"
            ? "It's a Draw!"
            : `Winner: ${winner}`
          : `Turn: ${player}`}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${n}, 80px)`,
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              style={{
                width: 80,
                height: 80,
                fontSize: 24,
                cursor: "pointer",
              }}
            >
              {cell}
            </button>
          ))
        )}
      </div>

      <button onClick={reset} style={{ marginTop: 20 }}>
        Reset
      </button>
    </div>
  );
}
