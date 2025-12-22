/**
 * ============================================================================
 * PROBLEM: Number of Islands (LeetCode #200)
 * ============================================================================
 *
 * Given an m x n 2D binary grid which represents a map of '1's (land)
 * and '0's (water), return the number of islands.
 *
 * An island is surrounded by water and is formed by connecting adjacent
 * lands horizontally or vertically. You may assume all four edges of the
 * grid are all surrounded by water.
 *
 * Example 1:
 *   1 1 1 1 0
 *   1 1 0 1 0
 *   1 1 0 0 0      Output: 1
 *   0 0 0 0 0
 *
 * Example 2:
 *   1 1 0 0 0
 *   1 1 0 0 0      Output: 3
 *   0 0 1 0 0
 *   0 0 0 1 1
 *
 * Constraints:
 * - m == grid.length, n == grid[i].length
 * - 1 <= m, n <= 300
 * - grid[i][j] is '0' or '1'
 *
 * ============================================================================
 * INTUITION: Island Sinking with DFS
 * ============================================================================
 *
 * 1. Scan the grid cell by cell
 * 2. When we find a '1' (land), we found a NEW island -> count++
 * 3. Use DFS to "sink" the entire island (turn all connected '1's to '0's)
 * 4. This prevents counting the same island twice
 *
 * Why mutate grid? Saves O(M*N) space vs using a separate visited set.
 *
 * Time Complexity: O(M * N) - visit each cell at most once
 * Space Complexity: O(M * N) - recursion stack in worst case
 * ============================================================================
 */

/**
 * @param {character[][]} grid
 * @return {number}
 */
const numIslands = (grid) => {
  if (!grid || !grid.length) return 0;

  let count = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  // DFS to "sink" the island - turn all connected '1's to '0's
  const dfs = (r, c) => {
    // Boundary check + water check
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === "0") {
      return;
    }

    // Sink current cell
    grid[r][c] = "0";

    // Visit all 4 neighbors
    dfs(r + 1, c); // Down
    dfs(r - 1, c); // Up
    dfs(r, c + 1); // Right
    dfs(r, c - 1); // Left
  };

  // Scan entire grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === "1") {
        count++;   // Found new island
        dfs(i, j); // Sink it
      }
    }
  }

  return count;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Single island
console.log("Test 1:", numIslands([
  ["1", "1", "1", "1", "0"],
  ["1", "1", "0", "1", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "0", "0", "0"],
]));
// Expected: 1

// Test 2: Three islands
console.log("Test 2:", numIslands([
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
]));
// Expected: 3

// Test 3: No islands
console.log("Test 3:", numIslands([
  ["0", "0", "0"],
  ["0", "0", "0"],
]));
// Expected: 0

// Test 4: All land
console.log("Test 4:", numIslands([
  ["1", "1", "1"],
  ["1", "1", "1"],
]));
// Expected: 1

// Test 5: Diagonal (not connected)
console.log("Test 5:", numIslands([
  ["1", "0", "1"],
  ["0", "1", "0"],
  ["1", "0", "1"],
]));
// Expected: 5
