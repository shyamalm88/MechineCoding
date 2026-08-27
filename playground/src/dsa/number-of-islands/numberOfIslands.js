/**
 * @param {character[][]} grid
 * @return {number}
 */
const numIslands = (grid) => {
  if (!grid || !grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  // Direction vectors: down, up, right, left
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const dfs = (r, c) => {
    // boundary + water check
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === "0") {
      return;
    }

    // sink land
    grid[r][c] = "0";

    // explore neighbors dynamically
    for (const [dr, dc] of directions) {
      let nr = dr + r;
      let nc = dc + c;
      dfs(nr, nc);
    }
  };

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === "1") {
        count++;
        dfs(i, j);
      }
    }
  }

  return count;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Single island
console.log(
  "Test 1:",
  numIslands([
    ["1", "1", "1", "1", "0"],
    ["1", "1", "0", "1", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "0", "0", "0"],
  ]),
);
// Expected: 1

// Test 2: Three islands
console.log(
  "Test 2:",
  numIslands([
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ]),
);
// Expected: 3

// Test 3: No islands
console.log(
  "Test 3:",
  numIslands([
    ["0", "0", "0"],
    ["0", "0", "0"],
  ]),
);
// Expected: 0

// Test 4: All land
console.log(
  "Test 4:",
  numIslands([
    ["1", "1", "1"],
    ["1", "1", "1"],
  ]),
);
// Expected: 1

// Test 5: Diagonal (not connected)
console.log(
  "Test 5:",
  numIslands([
    ["1", "0", "1"],
    ["0", "1", "0"],
    ["1", "0", "1"],
  ]),
);
// Expected: 5
