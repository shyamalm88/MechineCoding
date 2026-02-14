/**
 * ============================================================================
 * PROBLEM: Shortest Path with Obstacles Elimination (LeetCode #1293)
 * CATEGORY: 🟢 IMPORTANT (Grid BFS with State Expansion)
 * ============================================================================
 *
 * You are given an m x n grid where:
 * - 0 = empty cell
 * - 1 = obstacle
 *
 * You start at the top-left corner (0,0) and want to reach
 * the bottom-right corner (m-1, n-1).
 *
 * You can move in 4 directions:
 * - up, down, left, right
 * - each move costs 1 step
 *
 * You are also given an integer k, representing the maximum number
 * of obstacles you are allowed to eliminate.
 *
 * Return the MINIMUM number of steps required to reach the destination.
 * If it is not possible, return -1.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   grid = [
 *     [0,0,0],
 *     [1,1,0],
 *     [0,0,0],
 *     [0,1,1],
 *     [0,0,0]
 *   ]
 *   k = 1
 *
 *   Output: 6
 *
 * Example 2:
 *
 *   grid = [[0,1,1],[1,1,1],[1,0,0]]
 *   k = 1
 *
 *   Output: -1
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= m, n <= 40
 * - 1 <= k <= m * n
 *
 * ============================================================================
 * INTUITION: Why Plain BFS Is NOT Enough
 * ============================================================================
 *
 * This looks like a shortest path on a grid → BFS, right?
 *
 * Not quite.
 *
 * The twist:
 * - You can remove obstacles, but only k times
 *
 * Key Insight (VERY IMPORTANT):
 *
 *   Reaching the SAME cell with DIFFERENT remaining eliminations
 *   are DIFFERENT STATES.
 *
 * So:
 *   (r, c, remainingK = 2)  ≠  (r, c, remainingK = 0)
 *
 * A simple visited[r][c] is WRONG.
 *
 * ============================================================================
 * STATE MODELING
 * ============================================================================
 *
 * State = (row, col, remainingEliminations)
 *
 * BFS is still valid because:
 * - Every move costs exactly 1
 * - We want the minimum number of steps
 *
 * The only change:
 * - visited must track remaining eliminations
 *
 * ============================================================================
 * ALGORITHM (BFS with State)
 * ============================================================================
 *
 * 1. Use a queue for BFS:
 *      [row, col, remainingK, steps]
 *
 * 2. visited[r][c][k]:
 *      whether we have visited cell (r, c) with k eliminations left
 *
 * 3. Start from (0,0,k,0)
 *
 * 4. For each move:
 *      - If next cell is empty (0): remainingK stays same
 *      - If next cell is obstacle (1):
 *           → can move ONLY if remainingK > 0
 *           → remainingK decreases by 1
 *
 * 5. First time reaching destination is the shortest path
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - R = rows
 * - C = cols
 *
 * States = R × C × (k + 1)
 *
 * Time:  O(R × C × k)
 * Space: O(R × C × k)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🟢 IMPORTANT
 * ============================================================================
 *
 * Interviewers are testing:
 * - Can you recognize state-space BFS?
 * - Do you know when visited[r][c] is insufficient?
 * - Can you manage exponential-looking state safely?
 *
 * This problem is a direct cousin of:
 * - Teleport / power-up problems
 * - One-time ability shortest path problems
 *
 * Getting this right is a strong senior signal.
 * ============================================================================
 */

function shortestPath(grid, k) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Edge case: start == end
  if (rows === 1 && cols === 1) return 0;

  // visited[r][c][remainingK]
  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Array(k + 1).fill(false)),
  );

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = [[0, 0, k, 0]]; // r, c, remainingK, steps
  visited[0][0][k] = true;

  // -------------------------------
  // BFS
  // -------------------------------
  while (queue.length > 0) {
    const [r, c, remainingK, steps] = queue.shift();

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      // Destination reached
      if (nr === rows - 1 && nc === cols - 1) {
        return steps + 1;
      }

      const nextRemainingK = remainingK - grid[nr][nc];

      if (nextRemainingK >= 0 && !visited[nr][nc][nextRemainingK]) {
        visited[nr][nc][nextRemainingK] = true;
        queue.push([nr, nc, nextRemainingK, steps + 1]);
      }
    }
  }

  return -1;
}
