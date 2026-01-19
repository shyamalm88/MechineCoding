/**
 * ============================================================================
 * PROBLEM: Walls and Gates (LeetCode #286)
 * ============================================================================
 *
 * You are given an m x n grid rooms initialized with these three possible values:
 * - -1: A wall or an obstacle.
 * - 0: A gate.
 * - INF: Infinity means an empty room. We use the value 2^31 - 1 = 2147483647
 *   to represent INF as you may assume that the distance to a gate is less
 *   than 2147483647.
 *
 * Fill each empty room with the distance to its nearest gate. If it is
 * impossible to reach a gate, it should be filled with INF.
 *
 * Example 1:
 * Input: rooms = [
 *   [2147483647, -1, 0, 2147483647],
 *   [2147483647, 2147483647, 2147483647, -1],
 *   [2147483647, -1, 2147483647, -1],
 *   [0, -1, 2147483647, 2147483647]
 * ]
 * Output: [
 *   [3, -1, 0, 1],
 *   [2, 2, 1, -1],
 *   [1, -1, 2, -1],
 *   [0, -1, 3, 4]
 * ]
 *
 * Constraints:
 * - m == rooms.length
 * - n == rooms[i].length
 * - 1 <= m, n <= 250
 * - rooms[i][j] is -1, 0, or 2^31 - 1.
 *
 * ============================================================================
 * INTUITION: Multi-Source BFS
 * ============================================================================
 *
 * Why Multi-Source BFS?
 * - If we start BFS from each empty room to find the nearest gate, it would
 *   be very inefficient (O(k * m * n) where k is number of empty rooms).
 * - Instead, we can start BFS from ALL gates simultaneously.
 * - The moment we reach an empty room from ANY gate, that is the shortest
 *   distance to a gate.
 *
 * Algorithm:
 * 1. Traverse the grid to find all gates (0).
 * 2. Add all gates to the queue as the starting points (distance 0).
 * 3. Perform BFS:
 *    - Pop a cell (r, c).
 *    - Check all 4 neighbors.
 *    - If a neighbor is an empty room (INF), update its distance to
 *      current_dist + 1 and add to queue.
 *    - If a neighbor is a wall (-1) or already visited (distance < INF), skip.
 *
 * Time Complexity: O(M * N) - Each cell is visited at most once.
 * Space Complexity: O(M * N) - Queue size in worst case.
 * ============================================================================
 */

/**
 * @param {number[][]} rooms
 * @return {void} Do not return anything, modify rooms in-place instead.
 */
const wallsAndGates = (rooms) => {
  if (!rooms || rooms.length === 0) return;

  const rows = rooms.length;
  const cols = rooms[0].length;
  const INF = 2147483647;

  const q = [];
  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  // Step 1: Add all gates to the queue
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (rooms[i][j] === 0) {
        q.push([i, j]);
      }
    }
  }

  // Step 2: Multi-source BFS
  while (q.length) {
    let [r, c] = q.shift();

    for (let [dr, dc] of dirs) {
      let nr = dr + r;
      let nc = dc + c;

      // Check bounds and if cell is an empty room (INF)
      if (
        nr < 0 ||
        nc < 0 ||
        nr >= rows ||
        nc >= cols ||
        rooms[nr][nc] !== INF
      ) {
        continue;
      }

      rooms[nr][nc] = rooms[r][c] + 1;
      q.push([nr, nc]);
    }
  }
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Walls and Gates Tests ===\n");

const INF = 2147483647;

const test1 = [
  [INF, -1, 0, INF],
  [INF, INF, INF, -1],
  [INF, -1, INF, -1],
  [0, -1, INF, INF],
];
wallsAndGates(test1);
console.log("Test 1 Result:");
console.log(test1);
// Expected:
// [
//   [3, -1, 0, 1],
//   [2, 2, 1, -1],
//   [1, -1, 2, -1],
//   [0, -1, 3, 4]
// ]

const test2 = [[INF]];
wallsAndGates(test2);
console.log("\nTest 2 (Single Empty):", test2);
// Expected: [[2147483647]] (Unreachable)

const test3 = [[0]];
wallsAndGates(test3);
console.log("\nTest 3 (Single Gate):", test3);
// Expected: [[0]]

module.exports = { wallsAndGates };
