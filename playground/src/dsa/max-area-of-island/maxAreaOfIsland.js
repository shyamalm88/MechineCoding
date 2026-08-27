/**
 * @param {number[][]} grid
 * @return {number}
 */
const maxAreaOfIsland = (grid) => {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === 0) {
      return 0;
    }

    // Mark as visited (sink the island)
    grid[r][c] = 0;

    let area = 1;
    for (let [dr, dc] of dirs) {
      let nr = r + dr;
      let nc = c + dc;

      area += dfs(nr, nc);
    }

    return area;
  };

  let maxArea = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        maxArea = Math.max(maxArea, dfs(i, j));
      }
    }
  }
  return maxArea;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Max Area of Island Tests ===\n");

const test1 = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1],
  [0, 1, 0, 0, 1],
  [0, 1, 0, 0, 1],
];
// Island 1: (0,2) -> Area 1
// Island 2: (2,1),(2,2),(3,1),(4,1) -> Area 4
// Island 3: (2,4),(3,4),(4,4) -> Area 3
console.log("Test 1:", maxAreaOfIsland(test1));
// Expected: 4

const test2 = [[0, 0, 0, 0]];
console.log("Test 2 (No islands):", maxAreaOfIsland(test2));
// Expected: 0

const test3 = [
  [1, 1],
  [1, 1],
];
console.log("Test 3 (All land):", maxAreaOfIsland(test3));
// Expected: 4

module.exports = { maxAreaOfIsland };
