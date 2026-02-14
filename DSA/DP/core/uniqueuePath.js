/**
 * ============================================================================
 * PROBLEM: Unique Paths (LeetCode #62)
 * ============================================================================
 * There is a robot on an m x n grid. The robot is initially located at the
 * top-left corner (i.e., grid[0][0]). The robot tries to move to the
 * bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move
 * either down or right at any point in time.
 *
 * Given the two integers m and n, return the number of possible unique paths
 * that the robot can take to reach the bottom-right corner.
 *
 * Example 1:
 * Input: m = 3, n = 7
 * Output: 28
 *
 * Example 2:
 * Input: m = 3, n = 2
 * Output: 3
 *
 * Constraints:
 * - 1 <= m, n <= 100
 */

// ============================================================================
// APPROACH: Dynamic Programming (Bottom-Up)
// ============================================================================
/**
 * INTUITION:
 * Let dp[i][j] be the number of unique paths to reach cell (i, j).
 * Since we can only move Down or Right, we can reach (i, j) from:
 * 1. Top: (i-1, j)
 * 2. Left: (i, j-1)
 *
 * So, dp[i][j] = dp[i-1][j] + dp[i][j-1].
 * Base case: First row and first column always have 1 path (straight line).
 *
 * Time Complexity: O(M * N)
 * Space Complexity: O(M * N) (Can be optimized to O(N))
 */
const uniquePaths = (m, n) => {
  const dp = Array.from({ length: m }, () => Array(n).fill(1));

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Unique Paths Tests ===\n");

console.log("Test 1:", uniquePaths(3, 7)); // Expected: 28
console.log("Test 2:", uniquePaths(3, 2)); // Expected: 3

module.exports = { uniquePaths };
