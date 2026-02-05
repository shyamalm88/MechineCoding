import { useState } from "react";

export default function CountFour({ rows = 6, cols = 7 }) {
  const WIN = 4;

  const createBoard = () =>
    Array.from({ length: rows }, () => Array(cols).fill(null));

  const [board, setBoard] = useState(createBoard);
  const [player, setPlayer] = useState("Y"); // Y = Yellow, R = Red
  const [winner, setWinner] = useState(null);

  // Same 4 directions as TicTacToe
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal \
    [1, -1],  // diagonal /
  ];

  // SAME count logic as your TicTacToe
  const count = (board, r, c, dr, dc, player) => {
    let nr = r + dr;
    let nc = c + dc;
    let cnt = 0;

    while (
      nr >= 0 &&
      nc >= 0 &&
      nr < rows &&
      nc < cols &&
      board[nr][nc] === player
    ) {
      cnt++;
      nr += dr;
      nc += dc;
    }

    return cnt;
  };

  const checkWin = (board, r, c, player) => {
    for (let [dr, dc] of directions) {
      const total =
        1 +
        count(board, r, c, dr, dc, player) +
        count(board, r, c, -dr, -dc, player);

      if (total >= WIN) return true;
    }
    return false;
  };

  // Drop coin with gravity
  const dropCoin = (col) => {
    if (winner) return;

    const newBoard = board.map(row => [...row]);

    // bottom → top (gravity)
    for (let r = rows - 1; r >= 0; r--) {
      if (!newBoard[r][col]) {
        newBoard[r][col] = player;

        if (checkWin(newBoard, r, col, player)) {
          setWinner(player);
        } else {
          setPlayer(player === "Y" ? "R" : "Y");
        }

        setBoard(newBoard);
        return;
      }
    }
  };

  const reset = () => {
    setBoard(createBoard());
    setPlayer("Y");
    setWinner(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>
        {winner
          ? `Winner: ${winner}`
          : `Turn: ${player}`}
      </h2>

      {/* Column buttons */}
      <div style={{ marginBottom: 10, gap: 30, display: "flex", justifyContent: "center" }}>
        {Array.from({ length: cols }).map((_, c) => (
          <button key={c} onClick={() => dropCoin(c)}>
            ↓
          </button>
        ))}
      </div>

      {/* Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 60px)`,
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background:
                  cell === "Y"
                    ? "yellow"
                    : cell === "R"
                    ? "red"
                    : "#ddd",
              }}
            />
          ))
        )}
      </div>

      <button onClick={reset} style={{ marginTop: 20 }}>
        Reset
      </button>
    </div>
  );
}
