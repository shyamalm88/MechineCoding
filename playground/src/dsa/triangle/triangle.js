// ============================================================================
// APPROACH: Bottom-Up DP (in-place, O(N) space)
// ============================================================================
/**
 * STORY / INTUITION:
 * Start from the BOTTOM row. Each cell knows the best it can do from here.
 * Work upwards: for each cell, best path = its value + min(child below-left, child below-right).
 * When we reach the top, dp[0] holds the answer.
 *
 * WHY BOTTOM-UP? Avoids tracking the path, and we can reuse a single row array.
 *
 * DRY RUN: [[2],[3,4],[6,5,7],[4,1,8,3]]
 * Start: dp = [4,1,8,3] (last row)
 * Row 2 ([6,5,7]):
 *   dp[0] = 6 + min(4,1) = 7
 *   dp[1] = 5 + min(1,8) = 6
 *   dp[2] = 7 + min(8,3) = 10
 *   dp = [7,6,10]
 * Row 1 ([3,4]):
 *   dp[0] = 3 + min(7,6) = 9
 *   dp[1] = 4 + min(6,10) = 10
 *   dp = [9,10]
 * Row 0 ([2]):
 *   dp[0] = 2 + min(9,10) = 11
 * Result: 11 ✓
 *
 * Time:  O(N²) where N = number of rows
 * Space: O(N) — just one row at a time
 */
const minimumTotal = (triangle) => {
  const n = triangle.length;
  const dp = [...triangle[n - 1]]; // start from last row

  for (let row = n - 2; row >= 0; row--) {
    for (let col = 0; col <= row; col++) {
      dp[col] = triangle[row][col] + Math.min(dp[col], dp[col + 1]);
    }
  }

  return dp[0];
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Triangle Tests ===\n");

console.log("Test 1:", minimumTotal([[2],[3,4],[6,5,7],[4,1,8,3]])); // Expected: 11
console.log("Test 2:", minimumTotal([[-10]]));                       // Expected: -10
console.log("Test 3:", minimumTotal([[1],[2,3]]));                   // Expected: 3

module.exports = { minimumTotal };
