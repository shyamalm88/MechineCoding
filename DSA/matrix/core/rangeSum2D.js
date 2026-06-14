/**
 * ============================================================================
 * PROBLEM: Range Sum Query 2D - Immutable (LeetCode #304)
 * ============================================================================
 * Given a 2D matrix, handle multiple queries of the following type:
 * Calculate the sum of the elements of matrix inside the rectangle defined
 * by its upper left corner (row1, col1) and lower right corner (row2, col2).
 *
 * Example:
 * matrix = [
 *   [3,0,1,4,2],
 *   [5,6,3,2,1],
 *   [1,2,0,1,5],
 *   [4,1,0,1,7],
 *   [1,0,3,0,5]
 * ]
 * sumRegion(2,1,4,3) -> 8
 * sumRegion(1,1,2,2) -> 11
 * sumRegion(1,2,2,4) -> 12
 *
 * Constraints:
 * - 1 <= matrix.length, matrix[i].length <= 200
 * - -10^5 <= matrix[i][j] <= 10^5
 * - 0 <= row1 <= row2 < matrix.length
 * - 0 <= col1 <= col2 < matrix[0].length
 * - At most 10^4 calls will be made to sumRegion.
 */

// ============================================================================
// APPROACH: 2D Prefix Sum (precompute once, answer in O(1))
// ============================================================================
/**
 * STORY / INTUITION:
 * Build a "running total" grid `prefix` that's 1 row and 1 column LARGER
 * than the input, where `prefix[r][c]` = sum of every cell in the rectangle
 * from (0,0) to (r-1,c-1). The extra padding row/column of zeros means we
 * never have to special-case "row1 == 0" or "col1 == 0" later.
 *
 * Build it like a 2D running total, combining the cell above, the cell to
 * the left, minus the corner counted by BOTH (inclusion-exclusion):
 *   prefix[r][c] = matrix[r-1][c-1] + prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1]
 *
 * To answer sumRegion(r1,c1,r2,c2), take the big rectangle from (0,0) to
 * (r2,c2), then SUBTRACT the strip above row r1 and the strip left of col
 * c1 — but those two strips overlap in the top-left corner, so ADD that
 * corner back once:
 *   sum = prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]
 *
 * DRY RUN: matrix = [[3,0,1],[5,6,3]], query sumRegion(0,1,1,2)
 * prefix (3x4, padded):
 *   [0, 0, 0, 0]
 *   [0, 3, 3, 4]
 *   [0, 8, 14, 18]
 *
 * sumRegion(0,1,1,2) = prefix[2][3] - prefix[0][3] - prefix[2][1] + prefix[0][1]
 *                     = 18 - 0 - 8 + 0 = 10
 * Manual check: matrix[0][1]+matrix[0][2]+matrix[1][1]+matrix[1][2] = 0+1+6+3 = 10 ✓
 *
 * Time:  O(rows * cols) to build, O(1) per query
 * Space: O(rows * cols) for the prefix grid
 */
class NumMatrix {
  constructor(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    this.prefix = Array.from({ length: rows + 1 }, () =>
      new Array(cols + 1).fill(0)
    );

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        this.prefix[r][c] =
          matrix[r - 1][c - 1] +
          this.prefix[r - 1][c] +
          this.prefix[r][c - 1] -
          this.prefix[r - 1][c - 1];
      }
    }
  }

  sumRegion(row1, col1, row2, col2) {
    return (
      this.prefix[row2 + 1][col2 + 1] -
      this.prefix[row1][col2 + 1] -
      this.prefix[row2 + 1][col1] +
      this.prefix[row1][col1]
    );
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Range Sum Query 2D - Immutable Tests ===\n");

const matrix = [
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5],
];
const numMatrix = new NumMatrix(matrix);

console.log("Test 1:", numMatrix.sumRegion(2, 1, 4, 3)); // Expected: 8
console.log("Test 2:", numMatrix.sumRegion(1, 1, 2, 2)); // Expected: 11
console.log("Test 3:", numMatrix.sumRegion(1, 2, 2, 4)); // Expected: 12

module.exports = { NumMatrix };
