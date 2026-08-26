import { useState } from "react";

/**
 * ============================================================================
 * PROBLEM: Snake and Ladder - Shortest Path (BFS)
 * ============================================================================
 *
 * INTUITION:
 * The Snake and Ladder game can be modeled as a Directed Graph.
 * - Nodes: Squares 1 to 100.
 * - Edges: From square X, you can go to X+1, X+2, ..., X+6 (dice roll).
 * - Jumps: If a square has a snake or ladder, there is a directed edge
 *   from the start to the end of the snake/ladder (0 cost for the jump itself,
 *   but the dice roll counts as 1 move).
 *
 * We want the minimum dice throws to reach 100.
 * Since edges (dice throws) have equal weight (1 move), BFS is optimal.
 *
 * ALGORITHM:
 * 1. Start BFS from Node 1.
 * 2. For current node `curr`, try all dice rolls (1 to 6).
 * 3. Calculate `next` position.
 * 4. Check for Snake or Ladder at `next`. If present, move `next` to destination.
 * 5. If `next` hasn't been visited, add to queue and mark visited.
 * 6. Track the path taken to reconstruct it later.
 *
 * ============================================================================
 * DRY RUN EXAMPLE
 * ============================================================================
 * Start: 1. Target: 100.
 * Ladder: 2 -> 38.
 *
 * 1. Queue: [[1]]
 * 2. Pop [1]. Neighbors:
 *    - Roll 1 -> Land on 2 -> Ladder to 38. Path: [1, 38]. Push to Queue.
 *    - Roll 2 -> Land on 3. Path: [1, 3]. Push.
 *    ...
 *    - Roll 6 -> Land on 7. Path: [1, 7]. Push.
 *
 * 3. Pop [1, 38]. Neighbors of 38:
 *    - Roll 1 -> 39. Path: [1, 38, 39].
 *    ...
 *
 * 4. Eventually reach 100. The first time we see 100, that path is shortest.
 * ============================================================================
 */

const SIZE = 10;
const TOTAL = 100;

// snakes & ladders
const ladders = {
  2: 38,
  7: 14,
  8: 31,
  28: 84,
};

const snakes = {
  16: 6,
  49: 11,
  62: 19,
  87: 24,
};

// map number → (row, col)
function getPosition(num) {
  const rowFromBottom = Math.floor((num - 1) / SIZE);
  const row = SIZE - 1 - rowFromBottom;

  let col = (num - 1) % SIZE;
  // Zigzag: odd rows from bottom go right-to-left
  if (rowFromBottom % 2 === 1) col = SIZE - 1 - col;

  return { row, col };
}

// build grid
function buildGrid() {
  const grid = Array.from({ length: SIZE }, () =>
    Array(SIZE).fill(null)
  );

  for (let n = 1; n <= TOTAL; n++) {
    const { row, col } = getPosition(n);
    grid[row][col] = n;
  }
  return grid;
}

// BFS shortest path
function shortestPath() {
  const queue = [[1]]; // Store full paths: [[1], [1, 38], ...]
  const visited = new Set([1]); // Avoid cycles and redundant processing

  while (queue.length) {
    const path = queue.shift();
    const curr = path[path.length - 1];

    // Reached the end?
    if (curr === TOTAL) return path;

    // Try all 6 dice outcomes
    for (let d = 1; d <= 6; d++) {
      let next = curr + d;
      if (next > TOTAL) continue;

      // Apply jumps immediately
      if (ladders[next]) next = ladders[next];
      if (snakes[next]) next = snakes[next];

      // If not visited, add new path to queue
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return [];
}

export default function SnakeAndLadder() {
  const grid = buildGrid();
  const [path, setPath] = useState([]);

  const pathSet = new Set(path);

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h2>🎲 Snake & Ladder – Shortest Path</h2>

      <button
        onClick={() => setPath(shortestPath())}
        style={{
          padding: "8px 14px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Show Shortest Path
      </button>

      {path.length > 0 && (
        <div style={{ margin: "10px 0", fontWeight: "bold" }}>
          Minimum dice throws: {path.length - 1}
        </div>
      )}

      {/* INLINE GRID — NO CSS OVERRIDE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 60px)",
          gap: 8,
          width: "fit-content",
          marginTop: 10,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            // Determine cell color
            const isDark = (r + c) % 2 === 1;
            let bg = isDark ? "#779556" : "#ebecd0"; // Chessboard style

            if (cell === 1) bg = "#22c55e"; // Start Green
            else if (cell === 100) bg = "#ef4444"; // End Red
            else if (pathSet.has(cell)) bg = "#facc15"; // Path Yellow
            else if (ladders[cell] || snakes[cell]) bg = isDark ? "#557536" : "#dbdcc0"; // Slightly different for special cells

          return (
            <div
              key={cell}
              style={{
                width: 60,
                height: 60,
                background: bg,
                border: "1px solid rgba(0,0,0,0.1)",
                fontSize: 11,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: (cell === 1 || cell === 100) ? "white" : "inherit",
                fontWeight: "bold"
              }}
            >
              <strong>{cell}</strong>

              {ladders[cell] && (
                <span style={{ color: "green", fontSize: 10 }}>
                  🪜 → {ladders[cell]}
                </span>
              )}

              {snakes[cell] && (
                <span style={{ color: "red", fontSize: 10 }}>
                  🐍 → {snakes[cell]}
                </span>
              )}
            </div>
          );
        })
      )}
      </div>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <div>🟨 Shortest path (BFS)</div>
        <div>🪜 Ladder</div>
        <div>🐍 Snake</div>
      </div>
    </div>
  );
}
