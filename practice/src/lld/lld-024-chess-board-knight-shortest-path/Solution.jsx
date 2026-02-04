import { useState } from "react";
import "./styles.css";

const blocked = new Set([
  "3-3",
  "3-4",
  "4-3",
]);

export default function KnightShortestPath() {
  const N = 8;

  const knightMoves = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2],
  ];

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

      for (let [dr, dc] of knightMoves) {
        const nr = r + dr;
        const nc = c + dc;

        if (
          nr >= 0 &&
          nc >= 0 &&
          nr < N &&
          nc < N &&
          !visited[nr][nc] &&
          !blocked.has(`${nr}-${nc}`)
        ) {
          visited[nr][nc] = true;
          parent[nr][nc] = [r, c];
          queue.push([nr, nc]);
        }
      }
    }

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
      <h2>♞ Knight Shortest Path</h2>

      <button onClick={bfs}>Find Shortest Path</button>

      <div className="board">
        {Array.from({ length: N * N }).map((_, idx) => {
          const r = Math.floor(idx / N);
          const c = idx % N;

          const isStart = r === start[0] && c === start[1];
          const isEnd = r === target[0] && c === target[1];
          const isPath = path.some(([x, y]) => x === r && y === c);
          const isBlocked = blocked.has(`${r}-${c}`);
          const isDark = (r + c) % 2 === 1;

          return (
            <div
              key={`${r}-${c}`}
              className={`cell
                ${isDark ? "dark" : "light"}
                ${isPath ? "path" : ""}
                ${isStart ? "start" : ""}
                ${isEnd ? "end" : ""}
                ${isBlocked ? "blocked" : ""}`}
            >
              {isBlocked && "X"}
              {isStart && "S"}
              {isEnd && "T"}
            </div>
          );
        })}
      </div>

      <div className="legend">
        <div>🟩 Path = BFS shortest path</div>
        <div>⬛ X = Blocked</div>
        <div>S = Start</div>
        <div>T = Target</div>
      </div>
    </div>
  );
}
