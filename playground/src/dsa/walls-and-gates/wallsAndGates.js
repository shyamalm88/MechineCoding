/**
 * @param {number[][]} rooms
 * @return {void} Do not return anything, modify rooms in-place instead.
 */
const wallsAndGates = (rooms) => {
  if (!rooms || rooms.length === 0) return;

  const rows = rooms.length;
  const cols = rooms[0].length;
  const INF = Math.pow(2, 31) - 1;

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
