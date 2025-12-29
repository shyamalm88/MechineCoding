/**
 * ============================================================================
 * PROBLEM: Shortest Bridge (LeetCode #934)
 * ============================================================================
 * You are given an n x n binary matrix grid where 1 represents land and 0
 * represents water.
 *
 * An island is a 4-directionally connected group of 1s not connected to any
 * other 1s. There are exactly two islands in grid.
 *
 * You may change 0s to 1s to connect the two islands to form one island.
 * Return the smallest number of 0s you must flip to connect the two islands.
 *
 * Example 1:
 * Input: grid = [[0,1],[1,0]]
 * Output: 1
 *
 * Example 2:
 * Input: grid = [[0,1,0],[0,0,0],[0,0,1]]
 * Output: 2
 *
 * Constraints:
 * - n == grid.length == grid[i].length
 * - 2 <= n <= 100
 * - There are exactly two islands in grid.
 */

// ============================================================================
// APPROACH: DFS + BFS (Multi-source)
// ============================================================================
/**
 * INTUITION:
 * 1. Use DFS to find the *first* island. Mark all its cells as visited (2)
 *    and add them to a queue.
 * 2. Use BFS starting from all cells of the first island to expand outward
 *    layer by layer until we hit the *second* island (1).
 * 3. The distance traveled in BFS is the number of 0s flipped.
 *
 * Time Complexity: O(N^2) - We visit every cell at most a few times.
 * Space Complexity: O(N^2) - Recursion stack and queue.
 */
const shortestBridge = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let queue = [];
  let found = false;

  // DFS to find the first island and add to queue
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) {
      return;
    }
    if (grid[r][c] !== 1) return;

    // Mark as visited (part of island 1)
    grid[r][c] = 2;
    queue.push([r, c, 0]);

    for (let [dr, dc] of directions) {
      dfs(r + dr, c + dc);
    }
  };

  // Step 1: Find the first island
  for (let row = 0; row < rows && !found; row++) {
    for (let col = 0; col < cols && !found; col++) {
      if (grid[row][col] === 1) {
        dfs(row, col);
        found = true;
      }
    }
  }

  // Step 2: BFS to find the second island
  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();
    for (const [dr, dc] of directions) {
      let nr = row + dr;
      let nc = col + dc;

      if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;

      // Found the second island!
      if (grid[nr][nc] == 1) return dist;

      if (grid[nr][nc] === 0) {
        grid[nr][nc] = 2;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
  return -1;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Shortest Bridge Tests ===\n");

console.log(
  "Test 1:",
  shortestBridge([
    [0, 1],
    [1, 0],
  ])
); // Expected: 1

console.log(
  "Test 2:",
  shortestBridge([
    [0, 1, 0],
    [0, 0, 0],
    [0, 0, 1],
  ])
); // Expected: 2

console.log(
  "Test 3:",
  shortestBridge([
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ])
); // Expected: 1 (Inner island to outer ring)

module.exports = { shortestBridge };
