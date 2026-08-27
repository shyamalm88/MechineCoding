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
