/**
 * ============================================================================
 * PROBLEM: Shortest Path in Binary Matrix (LeetCode #1091)
 * ============================================================================
 * Given an n x n binary matrix grid, return the length of the shortest clear
 * path in the matrix. If there is no clear path, return -1.
 *
 * A clear path in a binary matrix is a path from the top-left cell (0, 0) to
 * the bottom-right cell (n - 1, n - 1) such that:
 * 1. All the visited cells of the path are 0.
 * 2. All the adjacent cells of the path are 8-directionally connected
 *    (i.e., they are different and share an edge or a corner).
 *
 * The length of a clear path is the number of visited cells of this path.
 *
 * Example 1:
 * Input: [[0,1],[1,0]]
 * Output: 2
 * Path: (0,0) -> (1,1)
 *
 * Example 2:
 * Input: [[0,0,0],[1,1,0],[1,1,0]]
 * Output: 4
 * Path: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2)
 *
 * Constraints:
 * - n == grid.length
 * - n == grid[i].length
 * - 1 <= n <= 100
 * - grid[i][j] is 0 or 1
 */

// ============================================================================
// APPROACH: BFS (Breadth-First Search)
// ============================================================================
/**
 * INTUITION:
 * We are looking for the SHORTEST path in an unweighted grid (each step cost is 1).
 * This is a classic use case for BFS. DFS would explore one path deeply and
 * might find a path, but not necessarily the shortest one without checking all.
 * BFS explores layer by layer (distance 1, then distance 2, etc.), guaranteeing
 * the first time we reach the target, it is via the shortest path.
 *
 * Key details:
 * - 8 Directions: Unlike standard mazes (4 directions), we can move diagonally.
 * - Visited Array: We can modify the input grid to mark visited cells (change 0 to 1)
 *   to save space, or use a separate Set/Matrix. Here we modify in-place.
 *
 * Time Complexity: O(N^2) - In worst case, we visit every cell once.
 * Space Complexity: O(N^2) - For the queue in worst case.
 */
const shortestPathBinaryMatrix = (grid) => {
  const n = grid.length;

  // Edge Case: Start or End is blocked
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;

  // Queue stores coordinates [row, col]
  const q = [[0, 0]];

  // Mark start as visited (set to 1)
  grid[0][0] = 1;

  let steps = 1; // Path length starts at 1

  // 8 possible directions
  const dirs = [
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, -1],
    [-1, 0],
    [0, -1],
    [-1, 1],
    [1, -1],
  ];

  while (q.length) {
    const size = q.length;

    // Process all nodes at the current distance level
    for (let i = 0; i < size; i++) {
      const [r, c] = q.shift();

      // Check if we reached the bottom-right corner
      if (r === n - 1 && c === n - 1) return steps;

      // Explore neighbors
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds and if cell is open (0)
        if (nr >= 0 && nc >= 0 && nr < n && nc < n && grid[nr][nc] === 0) {
          grid[nr][nc] = 1; // Mark as visited
          q.push([nr, nc]);
        }
      }
    }
    steps++; // Increment path length for next level
  }

  return -1;
};

// ============================================================================
// TEST CASES
// ============================================================================
const clone2D = (arr) => arr.map((row) => [...row]);

console.log("=== Shortest Path Binary Matrix Tests ===\n");

console.log(
  "Test 1 (2x2):",
  shortestPathBinaryMatrix(
    clone2D([
      [0, 1],
      [1, 0],
    ])
  )
); // Expected: 2
console.log(
  "Test 2 (3x3):",
  shortestPathBinaryMatrix(
    clone2D([
      [0, 0, 0],
      [1, 1, 0],
      [1, 1, 0],
    ])
  )
); // Expected: 4
console.log(
  "Test 3 (Blocked):",
  shortestPathBinaryMatrix(
    clone2D([
      [1, 0],
      [0, 0],
    ])
  )
); // Expected: -1

module.exports = { shortestPathBinaryMatrix };
