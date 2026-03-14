import { useState } from "react";

export default function TicTacToe({ size = 5 }) {
  const n = size;
  const WIN = n;

  const createBoard = () =>
    Array.from({ length: n }, () => Array(n).fill(null));

  const [board, setBoard] = useState(createBoard);
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [moves, setMoves] = useState(0);

  // Horizontal + Vertical only
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
  ];

  const count = (board, r, c, dr, dc, player) => {
    let nr = r + dr;
    let nc = c + dc;
    let cnt = 0;

    while (
      nr >= 0 &&
      nc >= 0 &&
      nr < board.length &&
      nc < board[0].length &&
      board[nr][nc] === player
    ) {
      cnt++;
      nr += dr;
      nc += dc;
    }

    return cnt;
  };

  const checkWin = (board, row, col, player) => {
    for (let [dr, dc] of directions) {
      const total =
        1 +
        count(board, row, col, dr, dc, player) +
        count(board, row, col, -dr, -dc, player);

      if (total >= WIN) return true;
    }
    return false;
  };

  const handleClick = (r, c) => {
    if (board[r][c] || winner) return;

    const newBoard = board.map((row) => [...row]);
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
          )),
        )}
      </div>

      <button onClick={reset} style={{ marginTop: 20 }}>
        Reset
      </button>
    </div>
  );
}
