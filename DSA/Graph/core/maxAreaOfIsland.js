/**
 * ============================================================================
 * PROBLEM: Max Area of Island (LeetCode #695)
 * ============================================================================
 *
 * You are given an m x n binary matrix grid. An island is a group of 1s
 * (representing land) connected 4-directionally (horizontal or vertical).
 * You may assume all four edges of the grid are surrounded by water.
 *
 * The area of an island is the number of cells with a value 1 in the island.
 *
 * Return the maximum area of an island in grid. If there is no island,
 * return 0.
 *
 * Example 1:
 * Input: grid = [
 *   [0,0,1,0,0,0,0,1,0,0,0,0,0],
 *   [0,0,0,0,0,0,0,1,1,1,0,0,0],
 *   [0,1,1,0,1,0,0,0,0,0,0,0,0],
 *   [0,1,0,0,1,1,0,0,1,0,1,0,0],
 *   [0,1,0,0,1,1,0,0,1,1,1,0,0],
 *   [0,0,0,0,0,0,0,0,0,0,1,0,0],
 *   [0,0,0,0,0,0,0,1,1,1,0,0,0],
 *   [0,0,0,0,0,0,0,1,1,0,0,0,0]
 * ]
 * Output: 6
 *
 * Constraints:
 * - m == grid.length
 * - n == grid[i].length
 * - 1 <= m, n <= 50
 * - grid[i][j] is either 0 or 1.
 *
 * ============================================================================
 * INTUITION: DFS (Sink the Island)
 * ============================================================================
 *
 * 1. Iterate through every cell in the grid.
 * 2. If we encounter a '1' (land), it means we found a new island.
 * 3. Start a DFS traversal from that cell to find the full extent of the island.
 * 4. During DFS:
 *    - Count the current cell (area + 1).
 *    - Mark the cell as visited by setting it to '0' (sink it). This avoids
 *      infinite loops and counting the same island twice.
 *    - Recursively visit all 4 neighbors.
 * 5. Keep track of the maximum area found so far.
 *
 * Time Complexity: O(M * N) - We visit each cell at most a constant number of times.
 * Space Complexity: O(M * N) - Recursion stack in the worst case (all land).
 * ============================================================================
 */

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
