import { useState } from "react";
import "./styles.css";

/**
 * ============================================================================
 * PROBLEM: Knight Shortest Path (BFS)
 * ============================================================================
 *
 * INTUITION:
 * A Knight in chess moves in an "L" shape: 2 squares in one cardinal direction
 * (horizontal or vertical) and then 1 square perpendicular to that direction.
 *
 * Unlike the Rook, the Knight "jumps" directly to the destination square.
 * It does not slide through intermediate squares.
 *
 * We want to find the minimum number of moves to get from Start to Target.
 * Since the graph is unweighted (each move = 1 step), BFS is the optimal algorithm.
 *
 * ALGORITHM (BFS):
 * 1. Start at (0,0).
 * 2. Explore all 8 possible Knight moves.
 * 3. If a move lands on a valid, unvisited board square, add it to the Queue.
 * 4. Track the 'parent' of each square to reconstruct the path later.
 * 5. Stop when we reach the Target.
 *
 * ============================================================================
 * DRY RUN EXAMPLE
 * ============================================================================
 * Board 8x8. Start (0,0). Target (2,1).
 *
 * 1. Queue: [(0,0)]
 * 2. Pop (0,0).
 *    - Possible moves: (1,2), (2,1).
 *    - (1,2): Valid. Queue push. Parent=(0,0).
 *    - (2,1): Valid. Queue push. Parent=(0,0).
 *
 * 3. Pop (1,2).
 *    - Explore neighbors...
 *
 * 4. Pop (2,1).
 *    - This is Target!
 *    - Path reconstruction: (2,1) -> Parent is (0,0).
 *    - Result: (0,0) -> (2,1). 1 Move.
 * ============================================================================
 */

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

      // Explore all 8 possible L-shaped moves
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

    // If target was never reached
    if (!visited[target[0]][target[1]]) {
      alert("Target is unreachable!");
      return;
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

      <div
        className="board"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${N}, 40px)`, // Ensure grid layout
          gap: "2px",
          marginTop: "20px",
        }}
      >
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
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ccc",
                backgroundColor: isPath ? "lightgreen" : isBlocked ? "black" : isDark ? "#779556" : "#ebecd0",
                color: isBlocked ? "white" : "inherit",
                fontWeight: "bold"
              }}
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
