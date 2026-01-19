/**
 * ============================================================================
 * PROBLEM: Rotting Oranges (LeetCode #994)
 * ============================================================================
 *
 * You are given an m x n grid where each cell can have one of three values:
 *   0 - Empty cell
 *   1 - Fresh orange
 *   2 - Rotten orange
 *
 * Every minute, any fresh orange that is 4-directionally adjacent to a
 * rotten orange becomes rotten.
 *
 * Return the minimum number of minutes that must elapse until no cell has
 * a fresh orange. If this is impossible, return -1.
 *
 * Example 1:
 *   2 1 1      2 2 1      2 2 2      2 2 2      2 2 2
 *   1 1 0  ->  2 1 0  ->  2 2 0  ->  2 2 0  ->  2 2 0
 *   0 1 1      0 1 1      0 1 1      0 2 1      0 2 2
 *   t=0        t=1        t=2        t=3        t=4
 *
 * Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
 * Output: 4
 *
 * Example 2:
 * Input: grid = [[2,1,1],[0,1,1],[1,0,1]]
 * Output: -1 (bottom-left orange is isolated)
 *
 * Constraints:
 * - m == grid.length, n == grid[i].length
 * - 1 <= m, n <= 10
 * - grid[i][j] is 0, 1, or 2
 *
 * ============================================================================
 * INTUITION: Multi-Source BFS (Level-Order)
 * ============================================================================
 *
 * Why BFS not DFS?
 * - We need SIMULTANEOUS spread from ALL rotten oranges
 * - BFS processes level-by-level (all oranges at same distance together)
 * - DFS would go deep first, not spread evenly
 *
 * Algorithm:
 * 1. Find all rotten oranges (sources) and count fresh oranges
 * 2. BFS: Process one "wave" per minute
 * 3. Each wave infects adjacent fresh oranges
 * 4. Stop when no fresh oranges left OR queue empty
 *
 * Time Complexity: O(M * N) - visit each cell at most once
 * Space Complexity: O(M * N) - queue can hold all cells
 * ============================================================================
 */

/**
 * @param {number[][]} grid
 * @return {number}
 */
const orangesRotting = (grid) => {
  if (!grid || !grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Step 1: Find all rotten oranges and count fresh ones
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 2) {
        queue.push([i, j]); // All rotten oranges start spreading simultaneously
      } else if (grid[i][j] === 1) {
        freshCount++;
      }
    }
  }

  // Edge case: No fresh oranges to rot
  if (freshCount === 0) return 0;

  let minutes = 0;
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Right, Down, Left, Up

  // Step 2: BFS - Process wave by wave
  while (freshCount > 0 && queue.length > 0) {
    // CRITICAL: Snapshot current level size
    // Only process oranges that were rotten at START of this minute
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();

      for (let [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds AND if neighbor is fresh
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;     // Infect!
          freshCount--;         // One less fresh orange
          queue.push([nr, nc]); // Add to next wave
        }
      }
    }

    minutes++; // One minute passed for this wave
  }

  // Step 3: Check if any fresh oranges remain (isolated)
  return freshCount === 0 ? minutes : -1;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Standard case
console.log("Test 1:", orangesRotting([
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1]
]));
// Expected: 4

// Test 2: Isolated orange (impossible)
console.log("Test 2:", orangesRotting([
  [2, 1, 1],
  [0, 1, 1],
  [1, 0, 1]
]));
// Expected: -1

// Test 3: No fresh oranges
console.log("Test 3:", orangesRotting([
  [0, 2]
]));
// Expected: 0

// Test 4: All fresh, no rotten (impossible)
console.log("Test 4:", orangesRotting([
  [1, 1, 1],
  [1, 1, 1]
]));
// Expected: -1

// Test 5: Already all rotten
console.log("Test 5:", orangesRotting([
  [2, 2, 2],
  [2, 2, 2]
]));
// Expected: 0

// Test 6: Single fresh next to rotten
console.log("Test 6:", orangesRotting([
  [2, 1]
]));
// Expected: 1
