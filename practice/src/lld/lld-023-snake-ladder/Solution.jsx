import { useState } from "react";

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
  const queue = [[1]];
  const visited = new Set([1]);

  while (queue.length) {
    const path = queue.shift();
    const curr = path[path.length - 1];

    if (curr === TOTAL) return path;

    for (let d = 1; d <= 6; d++) {
      let next = curr + d;
      if (next > TOTAL) continue;

      if (ladders[next]) next = ladders[next];
      if (snakes[next]) next = snakes[next];

      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return [];
}

export default function App() {
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
        {grid.flat().map((cell) => {
          let bg = "#eee";
          if (cell === 1) bg = "#22c55e";
          else if (cell === 100) bg = "#ef4444";
          else if (pathSet.has(cell)) bg = "#a7f3d0";

          return (
            <div
              key={cell}
              style={{
                width: 60,
                height: 60,
                background: bg,
                borderRadius: 6,
                fontSize: 11,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
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
        })}
      </div>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <div>🟩 Shortest path (BFS)</div>
        <div>🪜 Ladder</div>
        <div>🐍 Snake</div>
      </div>
    </div>
  );
}
