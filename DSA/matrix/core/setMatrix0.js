/**
 * ============================================================================
 * PROBLEM: Set Matrix Zeroes (LeetCode #73)
 * ============================================================================
 * Given an m x n integer matrix, if an element is 0, set its entire row and
 * column to 0's. You must do it in place.
 *
 * Example 1:
 * Input:  [[1,1,1],[1,0,1],[1,1,1]]
 * Output: [[1,0,1],[0,0,0],[1,0,1]]
 *
 * Visual:
 *   Before:        After:
 *   [1, 1, 1]      [1, 0, 1]
 *   [1, 0, 1]  →   [0, 0, 0]
 *   [1, 1, 1]      [1, 0, 1]
 *
 * Example 2:
 * Input:  [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
 * Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
 *
 * Constraints:
 * - m == matrix.length
 * - n == matrix[0].length
 * - 1 <= m, n <= 200
 * - -2^31 <= matrix[i][j] <= 2^31 - 1
 *
 * Follow up:
 * - Can you solve it with O(mn) space? (Brute force)
 * - Can you solve it with O(m + n) space? (Use marker arrays)
 * - Can you solve it with O(1) space? (Use first row/column as markers)
 */

// ============================================================================
// APPROACH 1: O(m + n) Space - Marker Sets
// ============================================================================
/**
 * INTUITION:
 * First pass: record which rows and which columns contain at least one 0,
 * using two sets. Second pass: zero out any cell whose row OR column was
 * marked.
 *
 * DRY RUN: [[1,1,1],[1,0,1],[1,1,1]]
 *  Pass 1: cell (1,1)=0 -> zeroRows={1}, zeroCols={1}
 *  Pass 2: every cell where row===1 or col===1 becomes 0
 *  Result: [[1,0,1],[0,0,0],[1,0,1]]
 *
 * Time Complexity: O(m × n)
 * Space Complexity: O(m + n) for the two marker sets
 */
const setMatrix0 = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const zeroRows = new Set();
  const zeroCols = new Set();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 0) {
        zeroRows.add(i);
        zeroCols.add(j);
      }
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (zeroRows.has(i) || zeroCols.has(j)) {
        grid[i][j] = 0;
      }
    }
  }

  return grid;
};

// ============================================================================
// APPROACH 2: Optimal - O(1) Space
// ============================================================================
/**
 * INTUITION:
 * Instead of using extra arrays, use the FIRST ROW and FIRST COLUMN of the
 * matrix itself as markers!
 *
 * Problem: The cell (0,0) is shared by both first row and first column.
 * Solution: Use two boolean flags to track if first row/column originally had 0s.
 *
 * Steps:
 * 1. Check if first row/column originally contain any 0s (save in flags)
 * 2. Use first row/column as markers for the REST of the matrix
 * 3. Zero out cells based on markers (skip first row/column)
 * 4. Finally, zero out first row/column if needed based on flags
 *
 * Visual of markers:
 *        col0  col1  col2  col3
 *       ┌─────┬─────┬─────┬─────┐
 * row0  │ X   │ M   │ M   │ M   │  ← First row marks columns
 *       ├─────┼─────┼─────┼─────┤
 * row1  │ M   │     │     │     │  ← First column marks rows
 *       ├─────┼─────┼─────┼─────┤
 * row2  │ M   │     │     │     │
 *       └─────┴─────┴─────┴─────┘
 *         ↑
 *    First col marks rows
 *
 * Time Complexity: O(m × n) - multiple passes but still linear
 * Space Complexity: O(1) - only two boolean variables
 */
const setMatrixZero = (grid) => {
  const row = grid.length;
  const col = grid[0].length;

  // Flags to track if first row/column originally had 0s
  let firstRowHave0 = false;
  let firstColHave0 = false;

  // Step 1a: Check if first COLUMN has any 0s
  for (let i = 0; i < row; i++) {
    if (grid[i][0] === 0) {
      firstColHave0 = true;
      break;
    }
  }

  // Step 1b: Check if first ROW has any 0s
  for (let j = 0; j < col; j++) {
    if (grid[0][j] === 0) {
      firstRowHave0 = true;
      break;
    }
  }

  // Step 2: Use first row/column as markers for rest of matrix
  // Scan from (1,1) to avoid overwriting our markers
  for (let i = 1; i < row; i++) {
    for (let j = 1; j < col; j++) {
      if (grid[i][j] === 0) {
        grid[i][0] = 0; // Mark this row (in first column)
        grid[0][j] = 0; // Mark this column (in first row)
      }
    }
  }

  // Step 3: Zero out cells based on markers (skip first row/column)
  for (let i = 1; i < row; i++) {
    for (let j = 1; j < col; j++) {
      if (grid[i][0] === 0 || grid[0][j] === 0) {
        grid[i][j] = 0;
      }
    }
  }

  // Step 4a: Zero out first ROW if it originally had 0
  if (firstRowHave0) {
    for (let i = 0; i < col; i++) {
      grid[0][i] = 0;
    }
  }

  // Step 4b: Zero out first COLUMN if it originally had 0
  if (firstColHave0) {
    for (let j = 0; j < row; j++) {
      grid[j][0] = 0;
    }
  }

  return grid;
};

// ============================================================================
// TEST CASES
// ============================================================================
const clone2D = (arr) => arr.map((row) => [...row]);

console.log("=== Set Matrix Zeroes Tests ===\n");

// Test 1
const m1 = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];
console.log("Test 1 (O(m+n) space):", JSON.stringify(setMatrix0(clone2D(m1))));
console.log(
  "Test 1 (O(1) space):  ",
  JSON.stringify(setMatrixZero(clone2D(m1))),
);
// Expected: [[1,0,1],[0,0,0],[1,0,1]]

// Test 2
const m2 = [
  [0, 1, 2, 0],
  [3, 4, 5, 2],
  [1, 3, 1, 5],
];
console.log("Test 2 (O(m+n) space):", JSON.stringify(setMatrix0(clone2D(m2))));
console.log(
  "Test 2 (O(1) space):  ",
  JSON.stringify(setMatrixZero(clone2D(m2))),
);
// Expected: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

// Test 3: No zeros
const m3 = [
  [1, 2],
  [3, 4],
];
console.log(
  "Test 3 (no zeros):    ",
  JSON.stringify(setMatrixZero(clone2D(m3))),
);
// Expected: [[1,2],[3,4]]

// Test 4: All zeros
const m4 = [
  [0, 0],
  [0, 0],
];
console.log(
  "Test 4 (all zeros):   ",
  JSON.stringify(setMatrixZero(clone2D(m4))),
);
// Expected: [[0,0],[0,0]]

// Test 5: Single element
const m5 = [[0]];
console.log(
  "Test 5 (single 0):    ",
  JSON.stringify(setMatrixZero(clone2D(m5))),
);
// Expected: [[0]]

const m6 = [[5]];
console.log(
  "Test 6 (single non-0):",
  JSON.stringify(setMatrixZero(clone2D(m6))),
);
// Expected: [[5]]

module.exports = { setMatrix0, setMatrixZero };
