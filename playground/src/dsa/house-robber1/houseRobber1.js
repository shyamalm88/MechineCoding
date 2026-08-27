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
