/**
 * ============================================================================
 * PROBLEM: Diagonal Traverse (LeetCode #498)
 * ============================================================================
 * Given an m x n matrix mat, return an array of all the elements of the array
 * in a diagonal order.
 *
 * Example 1:
 * Input: mat = [[1,2,3],[4,5,6],[7,8,9]]
 * Output: [1,2,4,7,5,3,6,8,9]
 *
 * Example 2:
 * Input: mat = [[1,2],[3,4]]
 * Output: [1,2,3,4]
 *
 * Constraints:
 * - m == mat.length
 * - n == mat[i].length
 * - 1 <= m, n <= 10^4
 * - 1 <= m * n <= 10^4
 * - -10^5 <= mat[i][j] <= 10^5
 */

// ============================================================================
// APPROACH: Group by Sum of Indices (r + c)
// ============================================================================
/**
 * INTUITION:
 * A key property of diagonals in a matrix is that for any cell (r, c) on a
 * specific diagonal (going from top-right to bottom-left), the sum of indices
 * (r + c) is constant.
 *
 * - Diagonal 0: (0,0) -> sum = 0
 * - Diagonal 1: (0,1), (1,0) -> sum = 1
 * - Diagonal 2: (0,2), (1,1), (2,0) -> sum = 2
 *
 * We can iterate through the matrix, group elements by this sum, and then
 * construct the result.
 *
 * The direction zig-zags:
 * - Even sums (0, 2, 4...): Traverse Up-Right.
 * - Odd sums (1, 3, 5...): Traverse Down-Left.
 *
 * Since standard iteration (row by row) collects elements for a given sum
 * in Down-Left order (increasing row index), we simply need to REVERSE the
 * collection for even sums to get the Up-Right order.
 *
 * DRY RUN:
 * Input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
 *
 * 1. Grouping by sum (r+c):
 *    Sum 0: [1]          (from 0,0)
 *    Sum 1: [2, 4]       (from 0,1 then 1,0)
 *    Sum 2: [3, 5, 7]    (from 0,2 then 1,1 then 2,0)
 *    Sum 3: [6, 8]       (from 1,2 then 2,1)
 *    Sum 4: [9]          (from 2,2)
 *
 * 2. Construct Result (Reverse even sums):
 *    d=0 (Even): Reverse [1] -> [1]
 *    d=1 (Odd):  Keep [2, 4] -> [2, 4]
 *    d=2 (Even): Reverse [3, 5, 7] -> [7, 5, 3]
 *    d=3 (Odd):  Keep [6, 8] -> [6, 8]
 *    d=4 (Even): Reverse [9] -> [9]
 *
 * Final: [1, 2, 4, 7, 5, 3, 6, 8, 9]
 *
 * Time Complexity: O(M * N) - Visit every element once.
 * Space Complexity: O(M * N) - To store the map and result.
 */
function diagonalTraverse(matrix) {
  if (!matrix.length) return [];

  const rows = matrix.length;
  const cols = matrix[0].length;
  const map = new Map();
  const result = [];

  // Group elements by diagonal key (r + c)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = r + c;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(matrix[r][c]);
    }
  }

  // Traverse diagonals in order
  for (let d = 0; d <= rows + cols - 2; d++) {
    const diagonal = map.get(d);
    if (d % 2 === 0) {
      diagonal.reverse(); // zig-zag
    }
    result.push(...diagonal);
  }

  return result;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Diagonal Traverse Tests ===\n");

// Test 1: 3x3 Matrix
const t1 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log("Test 1 (3x3):", diagonalTraverse(t1));
// Expected: [1, 2, 4, 7, 5, 3, 6, 8, 9]

// Test 2: 2x2 Matrix
const t2 = [
  [1, 2],
  [3, 4],
];
console.log("Test 2 (2x2):", diagonalTraverse(t2));
// Expected: [1, 2, 3, 4]

// Test 3: Rectangular (2x3)
const t3 = [
  [1, 2, 3],
  [4, 5, 6],
];
console.log("Test 3 (2x3):", diagonalTraverse(t3));
// Expected: [1, 2, 4, 5, 3, 6]

// Test 4: Single Row
const t4 = [[1, 2, 3]];
console.log("Test 4 (1x3):", diagonalTraverse(t4));
// Expected: [1, 2, 3]

// Test 5: Single Column
const t5 = [[1], [2], [3]];
console.log("Test 5 (3x1):", diagonalTraverse(t5));
// Expected: [1, 2, 3]

module.exports = { diagonalTraverse };
