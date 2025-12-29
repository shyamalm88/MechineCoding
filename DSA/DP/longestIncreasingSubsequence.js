/**
 * ============================================================================
 * PROBLEM: Longest Increasing Subsequence (LeetCode #300)
 * ============================================================================
 * Given an integer array nums, return the length of the longest strictly
 * increasing subsequence.
 *
 * Example 1:
 * Input: nums = [10,9,2,5,3,7,101,18]
 * Output: 4
 * Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
 *
 * Example 2:
 * Input: nums = [0,1,0,3,2,3]
 * Output: 4
 *
 * Constraints:
 * - 1 <= nums.length <= 2500
 * - -10^4 <= nums[i] <= 10^4
 */

// ============================================================================
// APPROACH: Dynamic Programming
// ============================================================================
/**
 * INTUITION:
 * Let dp[i] be the length of the longest increasing subsequence ending at index i.
 * To calculate dp[i], we look at all previous indices j < i.
 * If nums[j] < nums[i], we can extend the subsequence ending at j.
 * dp[i] = max(dp[i], dp[j] + 1).
 *
 * Time Complexity: O(N^2)
 * Space Complexity: O(N)
 */
const lengthOfLIS = (nums) => {
  const n = nums.length;
  if (n === 0) return 0;

  // dp[i] = LIS ending at index i
  const dp = new Array(n).fill(1);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Longest Increasing Subsequence Tests ===\n");

console.log("Test 1:", lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // Expected: 4
console.log("Test 2:", lengthOfLIS([0, 1, 0, 3, 2, 3])); // Expected: 4

module.exports = { lengthOfLIS };
