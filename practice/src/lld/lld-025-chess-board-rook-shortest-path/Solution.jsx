import { useState } from "react";
import "./styles.css";

export default function RookShortestPath() {
  const N = 8;

  // Example blocked cells
  const blocked = new Set([
    "3-3",
    "3-4",
    "4-3",
  ]);

  const [start] = useState([0, 0]);
  const [target] = useState([7, 7]);
  const [path, setPath] = useState([]);

  const bfs = () => {
    const visited = Array.from({ length: N }, () =>
      Array(N).fill(false)
    );
    const parent = Array.from({ length: N }, () =>
      Array(N).fill(null)
    );

    const queue = [];
    queue.push(start);
    visited[start[0]][start[1]] = true;

    while (queue.length) {
      const [r, c] = queue.shift();

      if (r === target[0] && c === target[1]) break;

      // 4 directions: up, down, left, right
      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

      for (let [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;

        // move continuously in one direction
        while (
          nr >= 0 &&
          nc >= 0 &&
          nr < N &&
          nc < N &&
          !blocked.has(`${nr}-${nc}`)
        ) {
          if (!visited[nr][nc]) {
            visited[nr][nc] = true;
            parent[nr][nc] = [r, c];
            queue.push([nr, nc]);
          }
          nr += dr;
          nc += dc;
        }
      }
    }

    // reconstruct path
    const result = [];
    let curr = target;

    while (curr) {
      result.push(curr);
      curr = parent[curr[0]][curr[1]];
    }

    setPath(result.reverse());
  };


  return (
    <div className="container">
      <h2>♜ Rook Shortest Path</h2>

      <button onClick={bfs}>Find Shortest Path</button>

      <div className="board">
        {Array.from({ length: N }).map((_, r) =>
          Array.from({ length: N }).map((_, c) => {
            const isDark = (r + c) % 2 === 1;
            const isStart = r === start[0] && c === start[1];
            const isEnd = r === target[0] && c === target[1];
            const isBlocked = blocked.has(`${r}-${c}`);
            const isPath = path.some(([x, y]) => x === r && y === c);


            return (
              <div
                className={`cell
                  ${isDark ? "dark" : "light"}
                  ${isBlocked ? "blocked" : ""}
                  ${isPath ? "path" : ""}
                  ${isStart ? "start" : ""}
                  ${isEnd ? "end" : ""}`}
              >
                {isBlocked && "X"}
                {isStart && "S"}
                {isEnd && "T"}
              </div>
            );
          })
        )}
      </div>

      <div className="legend">
        <div>🟩 Green: Shortest path</div>
        <div>⬛ X: Blocked cell</div>
        <div>S: Start</div>
        <div>T: Target</div>
        <div>Each straight line = 1 rook move</div>
      </div>
    </div>
  );
}
