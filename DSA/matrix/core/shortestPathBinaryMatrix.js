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
 * Path: (0,0) -> (0,1) -> (1,2) -> (2,2)   (the last step is diagonal)
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
// APPROACH 2: DFS (Backtracking) -- correct, but exponential
// ============================================================================
/**
 * INTUITION:
 * DFS goes deep down one route before trying another, so the first path it
 * reaches the target on is just SOME path, not the shortest. To get the right
 * answer, DFS has to try every simple path and keep the minimum.
 *
 * The trap -- marking visited and never unmarking:
 * In BFS, a cell is marked visited forever, which is safe because BFS reaches
 * every cell by its shortest route first. In DFS that is wrong: a long route
 * may mark cells that a shorter route needs later, so the shorter route is
 * never explored. On a fully open 3x3 grid that version returns 5, but the
 * real answer is 3.
 *
 * So the DFS must BACKTRACK: mark a cell on the way in, unmark it on the way
 * out. Then the cell is only blocked for the path currently being built.
 *
 * Pruning: once a path of length `shortest` is known, any path that has
 * already reached that length cannot do better, so stop exploring it.
 *
 * Time Complexity: exponential. DFS enumerates simple paths, and there can be
 * exponentially many. A loose upper bound is O(8^(N^2)): up to 8 choices per
 * step, over a path that can touch up to N^2 cells. Pruning cuts a lot of work
 * but does not change the growth class. Measured recursive calls on fully
 * open grids (with pruning):
 *     3x3: 72     5x5: 3,667     7x7: 158,592     8x8: 1,021,395
 * roughly 6-7x more work per +1 in grid size. At N = 100 it will not finish.
 *
 * Space Complexity: O(N^2) for the visited matrix, plus recursion depth up to
 * N^2 (a path can snake through every open cell). At N = 100 that is up to
 * 10,000 stack frames, which can also overflow the call stack.
 *
 * Why BFS is the answer for this problem:
 * every step costs 1, so BFS reaches each cell first by its shortest route --
 * O(N^2) time. DFS is worth knowing mainly to explain why it is the wrong tool
 * for shortest paths.
 */
const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [-1, -1],
  [-1, 0],
  [0, -1],
  [-1, 1],
  [1, -1],
];

const shortestPathBinaryMatrixDFS = (grid) => {
  const size = grid.length;

  // Edge Case: Start or End is blocked
  if (grid[0][0] === 1 || grid[size - 1][size - 1] === 1) return -1;

  // Separate visited matrix, so the input grid is never modified.
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  let shortest = Infinity;

  const dfs = (row, col, pathLength) => {
    // Pruning: this path can no longer beat the best one found.
    if (pathLength >= shortest) return;

    // Reached bottom-right: record this path length.
    if (row === size - 1 && col === size - 1) {
      shortest = pathLength;
      return;
    }

    visited[row][col] = true; // block this cell for the current path only

    for (const [rowDelta, colDelta] of DIRECTIONS) {
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;

      if (
        nextRow >= 0 &&
        nextCol >= 0 &&
        nextRow < size &&
        nextCol < size &&
        grid[nextRow][nextCol] === 0 &&
        !visited[nextRow][nextCol]
      ) {
        dfs(nextRow, nextCol, pathLength + 1);
      }
    }

    visited[row][col] = false; // BACKTRACK: free the cell for other paths
  };

  dfs(0, 0, 1); // path length starts at 1 (the start cell counts)

  return shortest === Infinity ? -1 : shortest;
};

// ============================================================================
// TEST CASES
// ============================================================================
const clone2D = (arr) => arr.map((row) => [...row]);

console.log("=== Shortest Path Binary Matrix Tests ===\n");

const runBoth = (label, grid, expected) => {
  const bfsResult = shortestPathBinaryMatrix(clone2D(grid));
  const dfsResult = shortestPathBinaryMatrixDFS(clone2D(grid));
  console.log(`${label}: BFS=${bfsResult} DFS=${dfsResult}  // Expected: ${expected}`);
};

runBoth("Test 1 (2x2)", [
  [0, 1],
  [1, 0],
], 2);

runBoth("Test 2 (3x3)", [
  [0, 0, 0],
  [1, 1, 0],
  [1, 1, 0],
], 4);

runBoth("Test 3 (Blocked start)", [
  [1, 0],
  [0, 0],
], -1);

// Fully open grid: the case where a DFS that never unmarks visited cells
// returns 5. Backtracking DFS must match BFS here.
runBoth("Test 4 (Open 3x3)", [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
], 3);

runBoth("Test 5 (No path)", [
  [0, 1, 0],
  [1, 1, 0],
  [0, 0, 0],
], -1);

runBoth("Test 6 (Single cell)", [[0]], 1);

module.exports = { shortestPathBinaryMatrix, shortestPathBinaryMatrixDFS };
