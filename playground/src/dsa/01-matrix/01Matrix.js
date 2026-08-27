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
