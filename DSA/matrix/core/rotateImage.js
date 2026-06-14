/**
 * ============================================================================
 * PROBLEM: Rotate Image (LeetCode #48)
 * ============================================================================
 * You are given an n x n 2D matrix representing an image. Rotate the image
 * by 90 degrees clockwise. You must rotate it IN-PLACE.
 *
 * Example 1:
 * Input:  [[1,2,3],[4,5,6],[7,8,9]]
 * Output: [[7,4,1],[8,5,2],[9,6,3]]
 *
 * Visual:
 *   Before:          After (90° clockwise):
 *   [1, 2, 3]        [7, 4, 1]
 *   [4, 5, 6]   →    [8, 5, 2]
 *   [7, 8, 9]        [9, 6, 3]
 *
 * Example 2:
 * Input:  [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
 * Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
 *
 * Constraints:
 * - n == matrix.length == matrix[i].length
 * - 1 <= n <= 20
 * - -1000 <= matrix[i][j] <= 1000
 */

// ============================================================================
// APPROACH: Transpose + Reverse
// ============================================================================
/**
 * INTUITION:
 * A 90° clockwise rotation can be achieved in two steps:
 * 1. TRANSPOSE: Swap rows and columns (element at [i][j] goes to [j][i])
 * 2. REVERSE: Reverse each row
 *
 * Visual breakdown:
 *
 *   Original:        After Transpose:    After Reverse Rows:
 *   [1, 2, 3]        [1, 4, 7]           [7, 4, 1]
 *   [4, 5, 6]   →    [2, 5, 8]      →    [8, 5, 2]
 *   [7, 8, 9]        [3, 6, 9]           [9, 6, 3]
 *
 * Why this works:
 * - Transpose mirrors the matrix along its main diagonal
 * - Reversing rows then flips it horizontally
 * - Combined effect = 90° clockwise rotation
 *
 * Alternative rotations:
 * - 90° counter-clockwise: Transpose → Reverse columns (or Reverse rows → Transpose)
 * - 180°: Reverse rows → Reverse columns
 *
 * Time Complexity: O(n²) - visit each element twice
 * Space Complexity: O(1) - in-place swaps, no extra space
 */
const rotateImage = (grid) => {
  const n = grid.length;

  // Step 1: TRANSPOSE the matrix
  // Swap elements across the main diagonal
  // Only iterate upper triangle (r < c) to avoid double-swapping
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) {
      // Swap grid[r][c] with grid[c][r]
      [grid[r][c], grid[c][r]] = [grid[c][r], grid[r][c]];
    }
  }

  // Step 2: REVERSE each row
  // This completes the 90° clockwise rotation
  for (let i = 0; i < n; i++) {
    grid[i].reverse();
  }

  return grid;
};

// ============================================================================
// TEST CASES
// ============================================================================
const clone2D = (arr) => arr.map((row) => [...row]);

console.log("=== Rotate Image Tests ===\n");

// Test 1: 3x3 matrix
const m1 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log("Test 1 (3x3):", JSON.stringify(rotateImage(clone2D(m1))));
// Expected: [[7,4,1],[8,5,2],[9,6,3]]

// Test 2: 4x4 matrix
const m2 = [
  [5, 1, 9, 11],
  [2, 4, 8, 10],
  [13, 3, 6, 7],
  [15, 14, 12, 16],
];
console.log("Test 2 (4x4):", JSON.stringify(rotateImage(clone2D(m2))));
// Expected: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]

// Test 3: 2x2 matrix
const m3 = [
  [1, 2],
  [3, 4],
];
console.log("Test 3 (2x2):", JSON.stringify(rotateImage(clone2D(m3))));
// Expected: [[3,1],[4,2]]

// Test 4: 1x1 matrix (edge case)
const m4 = [[1]];
console.log("Test 4 (1x1):", JSON.stringify(rotateImage(clone2D(m4))));
// Expected: [[1]]

module.exports = { rotateImage };
