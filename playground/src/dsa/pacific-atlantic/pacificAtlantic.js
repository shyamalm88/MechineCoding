/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function (heights) {
  if (!heights || heights.length === 0) return [];

  const rows = heights.length;
  const cols = heights[0].length;

  // These sets will store [row, col] as a string key "r,c"
  // to track which cells can reach which ocean.
  const canReachPacific = new Set();
  const canReachAtlantic = new Set();

  const bfs = (queue, reachableSet) => {
    const dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];

    while (queue.length) {
      const [r, c] = queue.shift();
      const key = `${r},${c}`;

      if (reachableSet.has(key)) continue;
      reachableSet.add(key);

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        // 1️⃣ Boundary check (ALWAYS FIXED)
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

        // 2️⃣ Problem-specific condition (Pacific Atlantic logic)
        // Reverse flow: can go to equal or higher height
        if (heights[nr][nc] >= heights[r][c]) {
          const nextKey = `${nr},${nc}`;
          if (!reachableSet.has(nextKey)) {
            queue.push([nr, nc]);
          }
        }
      }
    }
  };

  const pacificQueue = [];
  const atlanticQueue = [];

  // Initialize queues with the edges
  for (let i = 0; i < rows; i++) {
    pacificQueue.push([i, 0]); // Left edge (Pacific)
    atlanticQueue.push([i, cols - 1]); // Right edge (Atlantic)
  }
  for (let j = 0; j < cols; j++) {
    pacificQueue.push([0, j]); // Top edge (Pacific)
    atlanticQueue.push([rows - 1, j]); // Bottom edge (Atlantic)
  }

  // Run BFS for both oceans
  bfs(pacificQueue, canReachPacific);
  bfs(atlanticQueue, canReachAtlantic);

  // Find the intersection
  const result = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const key = `${i},${j}`;
      if (canReachPacific.has(key) && canReachAtlantic.has(key)) {
        result.push([i, j]);
      }
    }
  }

  return result;
};

// ============================================================================
// ALTERNATIVE: BFS Approach
// ============================================================================
const pacificAtlanticBFS = (heights) => {
  if (!heights || heights.length === 0) return [];

  const rows = heights.length;
  const cols = heights[0].length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const bfs = (starts) => {
    const reachable = new Set();
    const queue = [...starts];

    // Mark all starting cells
    for (let [r, c] of starts) {
      reachable.add(`${r}-${c}`);
    }

    while (queue.length > 0) {
      const [r, c] = queue.shift();

      for (let [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr}-${nc}`;

        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !reachable.has(key) &&
          heights[nr][nc] >= heights[r][c]
        ) {
          reachable.add(key);
          queue.push([nr, nc]);
        }
      }
    }

    return reachable;
  };

  // Pacific: top row + left column
  const pacificStarts = [];
  for (let r = 0; r < rows; r++) pacificStarts.push([r, 0]);
  for (let c = 1; c < cols; c++) pacificStarts.push([0, c]);

  // Atlantic: bottom row + right column
  const atlanticStarts = [];
  for (let r = 0; r < rows; r++) atlanticStarts.push([r, cols - 1]);
  for (let c = 0; c < cols - 1; c++) atlanticStarts.push([rows - 1, c]);

  const pacificReachable = bfs(pacificStarts);
  const atlanticReachable = bfs(atlanticStarts);

  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r}-${c}`;
      if (pacificReachable.has(key) && atlanticReachable.has(key)) {
        result.push([r, c]);
      }
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Standard example
console.log("Test 1:");
console.log(
  pacificAtlantic([
    [1, 2, 2, 3, 5],
    [3, 2, 3, 4, 4],
    [2, 4, 5, 3, 1],
    [6, 7, 1, 4, 5],
    [5, 1, 1, 2, 4],
  ]),
);
// Expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]

// Test 2: Single cell
console.log("\nTest 2:");
console.log(pacificAtlantic([[1]]));
// Expected: [[0,0]]

// Test 3: All same height
console.log("\nTest 3:");
console.log(
  pacificAtlantic([
    [1, 1],
    [1, 1],
  ]),
);
// Expected: [[0,0],[0,1],[1,0],[1,1]] (all cells can reach both)

// Test 4: Descending from top-left
console.log("\nTest 4:");
console.log(
  pacificAtlantic([
    [3, 2, 1],
    [2, 1, 0],
    [1, 0, 0],
  ]),
);
// Expected: [[0,0]] (only top-left corner flows to both)

// Test 5: Empty input
console.log("\nTest 5:");
console.log(pacificAtlantic([]));
// Expected: []

// Test 6: Single row
console.log("\nTest 6:");
console.log(pacificAtlantic([[1, 2, 3, 4, 5]]));
// Expected: All cells (single row touches both oceans at edges)

// Test 7: Single column
console.log("\nTest 7:");
console.log(pacificAtlantic([[1], [2], [3], [4], [5]]));
// Expected: All cells (single column touches both oceans at edges)

// Test 8: BFS approach
console.log("\nTest 8 - BFS approach:");
console.log(
  pacificAtlanticBFS([
    [1, 2, 2, 3, 5],
    [3, 2, 3, 4, 4],
    [2, 4, 5, 3, 1],
    [6, 7, 1, 4, 5],
    [5, 1, 1, 2, 4],
  ]),
);
// Expected: Same as Test 1
