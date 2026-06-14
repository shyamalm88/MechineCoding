/**
 * ============================================================================
 * PROBLEM: Spiral Matrix (LeetCode #54)
 * ============================================================================
 * Given an m x n matrix, return all elements of the matrix in spiral order.
 *
 * Example 1:
 * Input:  [[1,2,3],[4,5,6],[7,8,9]]
 * Output: [1,2,3,6,9,8,7,4,5]
 *
 * Visual:
 *   [1, 2, 3]
 *   [4, 5, 6]  →  [1,2,3,6,9,8,7,4,5]
 *   [7, 8, 9]
 *
 *   Traversal pattern:
 *   1 → 2 → 3
 *           ↓
 *   4 → 5   6
 *   ↑       ↓
 *   7 ← 8 ← 9
 *
 * Example 2:
 * Input:  [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
 * Output: [1,2,3,4,8,12,11,10,9,5,6,7]
 *
 * Constraints:
 * - m == matrix.length
 * - n == matrix[i].length
 * - 1 <= m, n <= 10
 * - -100 <= matrix[i][j] <= 100
 */

// ============================================================================
// APPROACH: Four Boundary Pointers
// ============================================================================
/**
 * INTUITION:
 * Use four pointers to track the boundaries of the unvisited portion:
 * - top: uppermost unvisited row
 * - bottom: lowermost unvisited row
 * - left: leftmost unvisited column
 * - right: rightmost unvisited column
 *
 * Traverse in 4 directions, shrinking boundaries after each direction:
 * 1. Left → Right (along top row), then move top down
 * 2. Top → Bottom (along right column), then move right left
 * 3. Right → Left (along bottom row), then move bottom up
 * 4. Bottom → Top (along left column), then move left right
 *
 * Visual of boundaries shrinking:
 *
 *   Initial:          After top row:      After right col:
 *   top=0              top=1               top=1
 *   ┌─────────┐        ┌─────────┐         ┌─────────┐
 *   │ 1  2  3 │        │ ✓  ✓  ✓ │         │ ✓  ✓  ✓ │
 *   │ 4  5  6 │        │ 4  5  6 │         │ 4  5  ✓ │
 *   │ 7  8  9 │        │ 7  8  9 │         │ 7  8  ✓ │
 *   └─────────┘        └─────────┘         └─────────┘
 *   left=0  right=2    left=0  right=2     left=0  right=1
 *
 * Time Complexity: O(m × n) - visit each cell exactly once
 * Space Complexity: O(1) - excluding output array (only pointers used)
 */
const spiralMatrix = (grid) => {
  // Handle edge cases
  if (!grid || !grid.length) return [];

  const row = grid.length;
  const col = grid[0].length;

  // Initialize four boundary pointers
  let top = 0; // Start from first row
  let right = col - 1; // Start from last column
  let left = 0; // Start from first column
  let bottom = row - 1; // Start from last row

  const res = [];

  // Continue while there are unvisited cells
  while (top <= bottom && left <= right) {
    // Step 1: Traverse LEFT → RIGHT along the top row
    for (let i = left; i <= right; i++) {
      res.push(grid[top][i]);
    }
    top++; // Shrink top boundary (top row is done)

    // Step 2: Traverse TOP → BOTTOM along the right column
    for (let i = top; i <= bottom; i++) {
      res.push(grid[i][right]);
    }
    right--; // Shrink right boundary (right column is done)

    // Check if there are remaining rows and columns
    // (Prevents duplicate traversal for single row/column cases)
    if (top <= bottom && left <= right) {
      // Step 3: Traverse RIGHT → LEFT along the bottom row
      if (top <= bottom) {
        for (let i = right; i >= left; i--) {
          res.push(grid[bottom][i]);
        }
        bottom--; // Shrink bottom boundary
      }

      // Step 4: Traverse BOTTOM → TOP along the left column
      if (left <= right) {
        for (let i = bottom; i >= top; i--) {
          res.push(grid[i][left]);
        }
        left++; // Shrink left boundary
      }
    }
  }
  return res;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Spiral Matrix Tests ===\n");

// Test 1: 3x3 matrix
const m1 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log("Test 1 (3x3):", JSON.stringify(spiralMatrix(m1)));
// Expected: [1,2,3,6,9,8,7,4,5]

// Test 2: 3x4 matrix
const m2 = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
];
console.log("Test 2 (3x4):", JSON.stringify(spiralMatrix(m2)));
// Expected: [1,2,3,4,8,12,11,10,9,5,6,7]

// Test 3: Single row
const m3 = [[1, 2, 3, 4]];
console.log("Test 3 (1x4):", JSON.stringify(spiralMatrix(m3)));
// Expected: [1,2,3,4]

// Test 4: Single column
const m4 = [[1], [2], [3], [4]];
console.log("Test 4 (4x1):", JSON.stringify(spiralMatrix(m4)));
// Expected: [1,2,3,4]

// Test 5: Single element
const m5 = [[42]];
console.log("Test 5 (1x1):", JSON.stringify(spiralMatrix(m5)));
// Expected: [42]

// Test 6: 2x2 matrix
const m6 = [
  [1, 2],
  [3, 4],
];
console.log("Test 6 (2x2):", JSON.stringify(spiralMatrix(m6)));
// Expected: [1,2,4,3]

module.exports = { spiralMatrix };
