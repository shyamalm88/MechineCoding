/**
 * ============================================================================
 * PROBLEM: Shortest Path in a Grid with Obstacles Elimination (LeetCode #1293)
 * ============================================================================
 * You are given an m x n integer matrix grid where each cell is either 0 (empty)
 * or 1 (obstacle). You can move up, down, left, or right from and to an empty
 * cell in one step.
 *
 * Return the minimum number of steps to walk from the upper left corner (0, 0)
 * to the lower right corner (m - 1, n - 1) given that you can eliminate at most
 * k obstacles. If it is not possible to find such a walk, return -1.
 *
 * Example:
 * Input: grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1
 * Output: 6
 */

// ============================================================================
// APPROACH: BFS with State (row, col, repairs_used)
// ============================================================================
/**
 * INTUITION:
 * This is a shortest path problem on a grid, which suggests BFS.
 * However, simply tracking (row, col) is insufficient because arriving at a
 * cell with 2 repairs remaining is better than arriving with 0 repairs remaining.
 *
 * We need to track the state: (row, col, repairs_used).
 *
 * Transitions:
 * - Move to neighbor (nr, nc).
 * - If grid[nr][nc] == 1 (obstacle), new_repairs = used + 1.
 * - If grid[nr][nc] == 0 (empty), new_repairs = used.
 * - Valid only if new_repairs <= K.
 *
 * We use a 3D visited array `visited[row][col][used]` to prevent cycles and
 * redundant work.
 *
 * DRY RUN:
 * Grid: [[0, 1, 0], [0, 0, 0]], K=1
 * Start (0,0), End (1,2)
 *
 * 1. Queue: [[0, 0, 0, 0]] (r, c, used, steps)
 *    Visited[0][0][0] = true
 *
 * 2. Pop [0, 0, 0, 0]. Neighbors:
 *    - (0, 1): Obstacle. Used becomes 1. 1 <= K.
 *      -> Push [0, 1, 1, 1]. Mark visited[0][1][1].
 *    - (1, 0): Empty. Used 0.
 *      -> Push [1, 0, 0, 1]. Mark visited[1][0][0].
 *
 * 3. Pop [0, 1, 1, 1]. Neighbors:
 *    - (0, 2): Empty. Used 1.
 *      -> Push [0, 2, 1, 2]. Mark visited[0][2][1].
 *
 * 4. Pop [1, 0, 0, 1]. Neighbors:
 *    - (1, 1): Empty. Used 0.
 *      -> Push [1, 1, 0, 2]. Mark visited[1][1][0].
 *
 * 5. Pop [0, 2, 1, 2].
 *    - (0, 2) is not end. Neighbors...
 *
 * ... Eventually BFS finds the shortest path to (1, 2).
 */
function shortestPathWithRepairs(grid, K) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [1, 0], // down
    [-1, 0], // up
    [0, 1], // right
    [0, -1], // left
  ];

  // visited[r][c][repairsUsed]
  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Array(K + 1).fill(false)),
  );

  // BFS queue: [row, col, repairsUsed, steps]
  const queue = [];
  queue.push([0, 0, 0, 0]);
  visited[0][0][0] = true;

  while (queue.length) {
    const [r, c, used, steps] = queue.shift();

    // Destination reached
    if (r === rows - 1 && c === cols - 1) {
      return steps;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      const nextUsed = used + grid[nr][nc]; // add repair if broken

      if (nextUsed > K) continue;

      if (!visited[nr][nc][nextUsed]) {
        visited[nr][nc][nextUsed] = true;
        queue.push([nr, nc, nextUsed, steps + 1]);
      }
    }
  }

  return -1;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Shortest Path with Repairs Tests ===\n");

// Test 1: Simple path with 1 obstacle, K=1
const t1 = [
  [0, 1, 0],
  [0, 0, 0],
];
console.log("Test 1 (K=1):", shortestPathWithRepairs(t1, 1));
// Expected: 3 (0,0 -> 0,1 -> 0,2 -> 1,2 is dist 3? No, 0,0->0,1->0,2 is dist 2. Wait, 0,0->0,1->0,2 is 2 steps. 0,0->1,0->1,1->1,2 is 3 steps.
// Actually path: (0,0)->(0,1)[break]->(0,2)[free] is not possible if we want (1,2).
// Path: (0,0)->(0,1)->(0,2)->(1,2) = 3 steps.

// Test 2: Obstacle blocking path, K=0
console.log("Test 2 (K=0):", shortestPathWithRepairs(t1, 0));
// Expected: 3 (Must go around: (0,0)->(1,0)->(1,1)->(1,2))

// Test 3: Wall of obstacles
const t3 = [
  [0, 1, 0],
  [0, 1, 0],
];
console.log("Test 3 (K=0):", shortestPathWithRepairs(t3, 0));
// Expected: -1
