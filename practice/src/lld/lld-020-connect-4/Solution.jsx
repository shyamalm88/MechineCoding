import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const rows = 6;
  const cols = 7;
  const [win, setWin] = useState(false);
  const [flag, setFlag] = useState(0);
  const [grid, setGrid] = useState(
    Array.from({ length: rows }, () => new Array(cols).fill(0))
  );

  const dirs = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal \
    [1, -1], // diagonal /
  ];

  const count = (board, r, c, dr, dc, val) => {
    let nr = r + dr;
    let nc = c + dc;
    let count = 0;

    while (
      nr >= 0 &&
      nc >= 0 &&
      nr < rows &&
      nc < cols &&
      board[nr][nc] === val
    ) {
      count++;
      nr += dr;
      nc += dc;
    }
    return count;
  };

  const checkWin = (board, r, c) => {
    const val = board[r][c];
    if (!val) return;
    for (let [dr, dc] of dirs) {
      let total =
        1 + count(board, r, c, dr, dc, val) + count(board, r, c, -dr, -dc, val);
      if (total >= 4) {
        setWin(true);
        return;
      }
    }
  };

  const dropCoin = (row, index) => {
    if (win) return false;
    const newGrid = grid.map((r) => [...r]);
    for (let col = row.length - 1; col >= 0; col--) {
      if (grid[index][col] === 0) {
        newGrid[index][col] = flag == 0 ? "Y" : "R";
        checkWin(newGrid, index, col);
        setGrid(newGrid);
        setFlag(!flag);
        return;
      }
    }
  };

  return (
    <div className="App">
      {win ? "Game Over" : flag == 0 ? "Yellow" : "Red"}
      <div className="gridWrapper">
        {grid.map((row, index) => {
          return (
            <div className="row">
              <button onClick={() => dropCoin(row, index)}>DropCoin</button>
              {row.map((col, idx) => {
                return (
                  <div className="cols" key={index + idx} style={{color: col == "R" ? "white" : "", background: col == "Y" ? "yellow": col === "R" ? "red" : ""}}>
                    {col}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
