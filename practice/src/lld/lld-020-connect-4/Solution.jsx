import { useState } from "react";
import "./styles.css";

export default function App() {
  const rows = 6;
  const cols = 7;

  const [grid, setGrid] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(0))
  );
  const [flag, setFlag] = useState(0); // 0 -> Yellow, 1 -> Red
  const [win, setWin] = useState(false);

  /* ================== WIN LOGIC ================== */

  const dirs = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal \
    [1, -1],  // diagonal /
  ];

  const count = (board, r, c, dr, dc, val) => {
    let nr = r + dr;
    let nc = c + dc;
    let cnt = 0;

    while (
      nr >= 0 &&
      nc >= 0 &&
      nr < rows &&
      nc < cols &&
      board[nr][nc] === val
    ) {
      cnt++;
      nr += dr;
      nc += dc;
    }
    return cnt;
  };

  const checkWin = (board, r, c) => {
    const val = board[r][c];
    if (!val) return false;

    for (let [dr, dc] of dirs) {
      const total =
        1 +
        count(board, r, c, dr, dc, val) +
        count(board, r, c, -dr, -dc, val);

      if (total >= 4) return true;
    }
    return false;
  };

  /* ================== DROP COIN ================== */

  const dropCoin = (col) => {
    if (win) return;

    const newGrid = grid.map(r => [...r]);

    // gravity: bottom → top
    for (let row = rows - 1; row >= 0; row--) {
      if (newGrid[row][col] === 0) {
        const player = flag === 0 ? "Y" : "R";
        newGrid[row][col] = player;

        if (checkWin(newGrid, row, col)) {
          setWin(true);
        }

        setGrid(newGrid);
        setFlag(flag ^ 1);
        return;
      }
    }
  };

  /* ================== UI ================== */

  return (
    <div className="App">
      <h2>
        {win ? "Game Over" : flag === 0 ? "Yellow's Turn" : "Red's Turn"}
      </h2>

      {/* Column buttons */}
      <div className="controls">
        {Array.from({ length: cols }).map((_, col) => (
          <button key={col} onClick={() => dropCoin(col)}>
            ↓
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="gridWrapper">
        {grid.map((row, r) => (
          <div className="row" key={r}>
            {row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className="cell"
                style={{
                  background:
                    cell === "Y"
                      ? "yellow"
                      : cell === "R"
                      ? "red"
                      : "#ddd",
                  color: cell === "R" ? "white" : "black",
                }}
              >
                {cell !== 0 ? cell : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
