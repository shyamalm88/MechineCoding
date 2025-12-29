/**
 * ============================================================================
 * PROBLEM: House Robber (LeetCode #198)
 * ============================================================================
 * You are a professional robber planning to rob houses along a street. Each house
 * has a certain amount of money stashed, the only constraint stopping you from
 * robbing each of them is that adjacent houses have security systems connected
 * and it will automatically contact the police if two adjacent houses were
 * broken into on the same night.
 *
 * Given an integer array nums representing the amount of money of each house,
 * return the maximum amount of money you can rob tonight without alerting the police.
 *
 * Example 1:
 * Input: nums = [1,2,3,1]
 * Output: 4
 * Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
 * Total amount you can rob = 1 + 3 = 4.
 *
 * Constraints:
 * - 1 <= nums.length <= 100
 * - 0 <= nums[i] <= 400
 */

// ============================================================================
// APPROACH: Dynamic Programming (Top-Down)
// ============================================================================
/**
 * INTUITION:
 * At each house `i`, we have two choices:
 * 1. Rob this house: Add money[i] and move to house `i+2`.
 * 2. Skip this house: Move to house `i+1`.
 *
 * Recurrence: dp[i] = max(money[i] + dp[i+2], dp[i+1])
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
const houseRobber1 = (money) => {
  const memo = {};

  const dfs = (i) => {
    if (i >= money.length) return 0;
    if (memo[i] !== undefined) return memo[i];

    memo[i] = Math.max(dfs(i + 1), money[i] + dfs(i + 2));

    return memo[i];
  };

  return dfs(0);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== House Robber I Tests ===\n");

console.log("Test 1:", houseRobber1([1, 2, 3, 1])); // Expected: 4
console.log("Test 2:", houseRobber1([2, 7, 9, 3, 1])); // Expected: 12

module.exports = { houseRobber1 };
