import { useState } from "react";
import "./styles.css";

/**
 * ============================================================================
 * PROBLEM: Rook Shortest Path (BFS)
 * ============================================================================
 *
 * INTUITION:
 * A Rook in chess can move any number of squares horizontally or vertically,
 * stopping only at the edge of the board or before a blocked square.
 *
 * We want to find the minimum number of *moves* (turns) to get from Start to Target.
 * This is a shortest-path problem on a graph where:
 * - Nodes: Each cell (r, c).
 * - Edges: From a cell, edges exist to ALL cells reachable in a straight line.
 * - Weight: 1 (each slide counts as 1 move).
 *
 * ALGORITHM (BFS with Sliding):
 * 1. Start at (0,0).
 * 2. For the current cell, explore all 4 directions (Up, Down, Left, Right).
 * 3. In each direction, "slide" continuously until we hit a wall or block.
 * 4. Add every cell encountered during the slide to the Queue (if not visited).
 * 5. IMPORTANT: Even if a cell is visited, we must continue sliding through it
 *    because the Rook can pass through visited squares to reach new ones.
 *
 * ============================================================================
 * DRY RUN EXAMPLE
 * ============================================================================
 * Board 4x4. Start (0,0). Target (0,2). Blocked (0,1).
 *
 * 1. Queue: [(0,0)]
 * 2. Pop (0,0).
 *    - Slide Right:
 *      - Check (0,1): BLOCKED. Stop sliding right.
 *    - Slide Down:
 *      - (1,0): New. Queue push (1,0). Parent=(0,0).
 *      - (2,0): New. Queue push (2,0). Parent=(0,0).
 *      - (3,0): New. Queue push (3,0). Parent=(0,0).
 *
 * 3. Pop (1,0).
 *    - Slide Right:
 *      - (1,1): New. Queue push. Parent=(1,0).
 *      - (1,2): New. Queue push. Parent=(1,0).
 *    - Slide Up:
 *      - (0,0): Visited. Continue.
 *
 * 4. Eventually we pop (1,2) (or similar) and slide Up to reach (0,2).
 *    Path: (0,0) -> (1,0) -> (1,2) -> (0,2) (3 moves).
 *    (Note: Direct path (0,0)->(0,2) was blocked).
 * ============================================================================
 */

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

      // 4 directions: down, up, right, left
      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

      for (let [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;

        // SLIDE continuously in one direction
        // A Rook moves until it hits a boundary or a blocked cell
        while (
          nr >= 0 &&
          nc >= 0 &&
          nr < N &&
          nc < N &&
          !blocked.has(`${nr}-${nc}`)
        ) {
          // If we haven't visited this cell yet, record it
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

    // If target was never reached
    if (!visited[target[0]][target[1]]) {
      alert("Target is unreachable!");
      return;
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

      <div
        className="board"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${N}, 40px)`, // Ensure grid layout
          gap: "2px",
          marginTop: "20px",
        }}
      >
        {Array.from({ length: N }).map((_, r) =>
          Array.from({ length: N }).map((_, c) => {
            const isDark = (r + c) % 2 === 1;
            const isStart = r === start[0] && c === start[1];
            const isEnd = r === target[0] && c === target[1];
            const isBlocked = blocked.has(`${r}-${c}`);
            const isPath = path.some(([x, y]) => x === r && y === c);

            return (
              <div
                key={`${r}-${c}`} // FIX: Added missing key prop
                className={`cell
                  ${isDark ? "dark" : "light"}
                  ${isBlocked ? "blocked" : ""}
                  ${isPath ? "path" : ""}
                  ${isStart ? "start" : ""}
                  ${isEnd ? "end" : ""}`}
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
