/**
 * ============================================================================
 * PROBLEM: House Robber II (LeetCode #213)
 * ============================================================================
 * You are a professional robber planning to rob houses along a street. Each house
 * has a certain amount of money stashed. All houses at this place are arranged
 * in a circle. That means the first house is the neighbor of the last one.
 *
 * Adjacent houses have security systems connected and it will automatically
 * contact the police if two adjacent houses were broken into on the same night.
 *
 * Given an integer array nums representing the amount of money of each house,
 * return the maximum amount of money you can rob tonight without alerting the police.
 *
 * Example 1:
 * Input: nums = [2,3,2]
 * Output: 3
 * Explanation: You cannot rob house 1 (money = 2) and then rob house 3 (money = 2),
 * because they are adjacent houses.
 *
 * Constraints:
 * - 1 <= nums.length <= 100
 * - 0 <= nums[i] <= 1000
 */

// ============================================================================
// APPROACH: Dynamic Programming (Break the Circle)
// ============================================================================
/**
 * INTUITION:
 * Since House[0] and House[n-1] are neighbors, we cannot rob both.
 * This breaks down into two linear House Robber problems:
 * 1. Rob houses from index 0 to n-2 (exclude last house).
 * 2. Rob houses from index 1 to n-1 (exclude first house).
 * The answer is the maximum of these two scenarios.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N) (Recursion stack + Memo)
 */
const houseRobberII = (money) => {
  const robLinear = (arr) => {
    const memo = {};

    const dfs = (i) => {
      if (i >= arr.length) return 0;
      if (memo[i] !== undefined) return memo[i];

      memo[i] = Math.max(dfs(i + 1), arr[i] + dfs(i + 2));
      return memo[i];
    };

    return dfs(0);
  };

  if (money.length === 1) return money[0];

  const case1 = robLinear(money.slice(1)); // skip first
  const case2 = robLinear(money.slice(0, -1)); // skip last

  return Math.max(case1, case2);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== House Robber II Tests ===\n");

console.log("Test 1:", houseRobberII([2, 3, 2])); // Expected: 3
console.log("Test 2:", houseRobberII([1, 2, 3, 1])); // Expected: 4
console.log("Test 3:", houseRobberII([1, 2, 3])); // Expected: 3

module.exports = { houseRobberII };
