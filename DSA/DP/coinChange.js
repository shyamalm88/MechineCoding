/**
 * ============================================================================
 * PROBLEM: Coin Change (LeetCode #322)
 * ============================================================================
 * You are given an integer array coins representing coins of different denominations
 * and an integer amount representing a total amount of money.
 *
 * Return the fewest number of coins that you need to make up that amount.
 * If that amount of money cannot be made up by any combination of the coins, return -1.
 *
 * You may assume that you have an infinite number of each kind of coin.
 *
 * Example 1:
 * Input: coins = [1,2,5], amount = 11
 * Output: 3
 * Explanation: 11 = 5 + 5 + 1
 *
 * Example 2:
 * Input: coins = [2], amount = 3
 * Output: -1
 *
 * Constraints:
 * - 1 <= coins.length <= 12
 * - 1 <= coins[i] <= 2^31 - 1
 * - 0 <= amount <= 10^4
 */

// ============================================================================
// APPROACH: Dynamic Programming (Top-Down)
// ============================================================================
/**
 * INTUITION:
 * We want to find min coins for `amount`.
 * For each coin `c` in coins, if we take it, we need 1 + minCoins(amount - c).
 * We try all coins and take the minimum.
 *
 * Time Complexity: O(Amount * Coins)
 * Space Complexity: O(Amount)
 */
const coinChange = (coins, amount) => {
  const memo = {};

  const dfs = (rem) => {
    if (rem === 0) return 0;
    if (rem < 0) return -1;

    if (memo[rem] !== undefined) return memo[rem];

    let min = Infinity;

    for (let coin of coins) {
      const res = dfs(rem - coin);
      if (res >= 0) {
        min = Math.min(min, res + 1);
      }
    }

    memo[rem] = min === Infinity ? -1 : min;
    return memo[rem];
  };

  return dfs(amount);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Coin Change Tests ===\n");

console.log("Test 1:", coinChange([1, 2, 5], 11)); // Expected: 3
console.log("Test 2:", coinChange([2], 3)); // Expected: -1

module.exports = { coinChange };
