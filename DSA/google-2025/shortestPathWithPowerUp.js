/**
 * ============================================================================
 * PROBLEM: Shortest Path with Power-Up (Hammer)
 * ============================================================================
 * Find the shortest path in a grid from (0,0) to (rows-1, cols-1).
 * - 0: Empty cell
 * - 1: Wall (cannot pass without hammer)
 *
 * There is a hammer located at a specific coordinate `hammer = [hr, hc]`.
 * Once you visit the hammer cell, you possess the hammer and can pass through
 * any wall (1) from that point onwards.
 */

// ============================================================================
// APPROACH: BFS with State (row, col, hasHammer)
// ============================================================================
/**
 * INTUITION:
 * The ability to traverse walls depends on whether we have visited the hammer
 * location. This creates two "layers" of the grid:
 * 1. Layer 0: No hammer. Can only walk on 0s.
 * 2. Layer 1: Has hammer. Can walk on 0s and 1s.
 *
 * We use BFS with state `(row, col, hasHammer)`.
 *
 * Transitions:
 * - If at hammer location, `hasHammer` becomes 1.
 * - If `hasHammer` is 0, can only move to 0.
 * - If `hasHammer` is 1, can move to 0 or 1.
 *
 * DRY RUN:
 * Grid: [[0, 1, 0], [0, 1, 0]], Hammer: [0, 2]
 * Start (0,0), End (1,2)
 *
 * 1. Queue: [[0, 0, 0, 0]] (r, c, hammer, steps)
 *
 * 2. Pop [0, 0, 0, 0].
 *    - Right (0, 1) is Wall. No hammer. Blocked.
 *    - Down (1, 0) is 0. Push [1, 0, 0, 1].
 *
 * 3. Pop [1, 0, 0, 1].
 *    - Right (1, 1) is Wall. Blocked.
 *    - Up (0, 0) visited.
 *
 * Wait... this path is blocked.
 * If Hammer was at [1, 0], we would pick it up, then cross (1, 1).
 *
 * Time Complexity: O(R * C)
 */
function shortestPathWithPowerUp(grid, hammer) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // visited[r][c][0/1] → whether we've visited (r,c) without/with hammer
  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => [false, false]),
  );

  const queue = [];
  queue.push([0, 0, 0, 0]); // r, c, hasHammer(0/1), steps
  visited[0][0][0] = true;

  while (queue.length) {
    const [r, c, hasHammer, steps] = queue.shift();

    if (r === rows - 1 && c === cols - 1) {
      return steps;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      let nextHasHammer = hasHammer;

      // Pick up hammer if present
      if (nr === hammer[0] && nc === hammer[1]) {
        nextHasHammer = 1;
      }

      // Cannot pass wall without hammer
      if (grid[nr][nc] === 1 && nextHasHammer === 0) continue;

      if (!visited[nr][nc][nextHasHammer]) {
        visited[nr][nc][nextHasHammer] = true;
        queue.push([nr, nc, nextHasHammer, steps + 1]);
      }
    }
  }

  return -1;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Shortest Path with PowerUp Tests ===\n");

// Test 1: Wall blocks path, but hammer allows breaking through
// 0 1 0
// 0 1 0
// Hammer at (1, 0). Start (0,0) -> (1,0)[Get Hammer] -> (1,1)[Break Wall] -> (1,2)
const grid1 = [
  [0, 1, 0],
  [0, 1, 0],
];
const hammer1 = [1, 0];
console.log("Test 1:", shortestPathWithPowerUp(grid1, hammer1));
// Expected: 3 steps: (0,0)->(1,0)->(1,1)->(1,2)

// Test 2: No hammer needed
const grid2 = [[0, 0, 0]];
console.log("Test 2:", shortestPathWithPowerUp(grid2, [0, 0]));
// Expected: 2
