/**
 * ============================================================================
 * PROBLEM: 01 Matrix (LeetCode #542)
 * ============================================================================
 *
 * Given an m x n binary matrix mat, return the distance of the nearest 0 for
 * each cell.
 *
 * The distance between two adjacent cells is 1.
 *
 * Example 1:
 * Input: mat = [[0,0,0],[0,1,0],[0,0,0]]
 * Output: [[0,0,0],[0,1,0],[0,0,0]]
 *
 * Example 2:
 * Input: mat = [[0,0,0],[0,1,0],[1,1,1]]
 * Output: [[0,0,0],[0,1,0],[1,2,1]]
 *
 * Constraints:
 * - m == mat.length
 * - n == mat[i].length
 * - 1 <= m, n <= 10^4
 * - 1 <= m * n <= 10^4
 * - mat[i][j] is either 0 or 1.
 * - There is at least one 0 in mat.
 *
 * ============================================================================
 * INTUITION: Multi-Source BFS
 * ============================================================================
 *
 * This problem is equivalent to finding the shortest path from each '1' to
 * the nearest '0'.
 *
 * Instead of running BFS from every '1' (which would be inefficient), we can
 * think of this in reverse: Start BFS from ALL '0's simultaneously.
 *
 * Algorithm:
 * 1. Initialize a distance matrix with Infinity (representing unvisited).
 * 2. Iterate through the grid. If a cell is 0, set its distance to 0 and
 *    add it to the queue.
 * 3. Perform BFS:
 *    - Pop a cell (r, c).
 *    - Check its 4 neighbors.
 *    - If a neighbor has not been visited (distance is Infinity), set its
 *      distance to current_dist + 1 and add to queue.
 *
 * This ensures that when we first reach a '1', it is via the shortest path
 * from a '0'.
 *
 * Time Complexity: O(M * N) - Each cell is processed at most once.
 * Space Complexity: O(M * N) - For the queue and distance matrix.
 * ============================================================================
 */

/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
const updateMatrix = (mat) => {
  if (!mat || mat.length === 0) return [];

  const rows = mat.length;
  const cols = mat[0].length;

  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  // Initialize distance matrix with Infinity
  // This acts as both the result matrix and the visited set
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

  const q = [];

  // Step 1: Add all 0s to the queue (distance 0)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (mat[i][j] === 0) {
        dist[i][j] = 0;
        q.push([i, j]);
      }
    }
  }

  // Step 2: Multi-source BFS
  while (q.length) {
    const [r, c] = q.shift();

    for (let [dr, dc] of dirs) {
      let nr = dr + r;
      let nc = dc + c;

      // Check bounds
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      // If neighbor has not been visited (distance is Infinity)
      if (dist[nr][nc] === Infinity) {
        dist[nr][nc] = dist[r][c] + 1;
        q.push([nr, nc]);
      }
    }
  }
  return dist;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== 01 Matrix Tests ===\n");

const test1 = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];
console.log("Test 1:", updateMatrix(test1));
// Expected: [[0,0,0],[0,1,0],[0,0,0]]

const test2 = [
  [0, 0, 0],
  [0, 1, 0],
  [1, 1, 1],
];
console.log("Test 2:", updateMatrix(test2));
// Expected: [[0,0,0],[0,1,0],[1,2,1]]

const test3 = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 0],
];
console.log("Test 3:", updateMatrix(test3));
// Expected: [[4,3,2],[3,2,1],[2,1,0]]

module.exports = { updateMatrix };
