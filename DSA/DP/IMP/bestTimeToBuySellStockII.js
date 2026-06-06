/**
 * ============================================================================
 * PROBLEM: Best Time to Buy and Sell Stock II (LeetCode #122) — UNLIMITED transactions
 * ============================================================================
 * Buy and sell as many times as you want (but can only hold 1 share at a time).
 * Return the maximum profit.
 *
 * Example 1:
 * Input: prices=[7,1,5,3,6,4] → Output: 7  (buy@1,sell@5=+4; buy@3,sell@6=+3)
 *
 * Example 2:
 * Input: prices=[1,2,3,4,5] → Output: 4  (buy@1, sell@5; or buy every day sell next)
 *
 * Example 3:
 * Input: prices=[7,6,4,3,1] → Output: 0
 *
 * Constraints:
 * - 1 <= prices.length <= 3 * 10^4
 * - 0 <= prices[i] <= 10^4
 */

// ============================================================================
// APPROACH: Greedy — Collect every upward slope
// ============================================================================
/**
 * STORY / INTUITION:
 * With unlimited transactions, the optimal strategy is to capture EVERY price increase.
 * If tomorrow is higher than today → buy today, sell tomorrow.
 * This is equivalent to adding up all positive differences.
 *
 * Think of it as: the total profit = sum of all uphill segments.
 * You can simulate buying/selling daily: buy Mon sell Tue, buy Tue sell Wed...
 * Same as holding Mon→Wed and selling once.
 *
 * DRY RUN: [7,1,5,3,6,4]
 * (1→7): negative → skip
 * (7→1): negative → skip
 * (1→5): +4 → take it
 * (5→3): negative → skip
 * (3→6): +3 → take it
 * (6→4): negative → skip
 * Total: 4 + 3 = 7 ✓
 *
 * Time:  O(N)
 * Space: O(1)
 */
const maxProfit = (prices) => {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  return profit;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Best Time to Buy and Sell Stock II Tests ===\n");

console.log("Test 1:", maxProfit([7, 1, 5, 3, 6, 4])); // Expected: 7
console.log("Test 2:", maxProfit([1, 2, 3, 4, 5]));    // Expected: 4
console.log("Test 3:", maxProfit([7, 6, 4, 3, 1]));    // Expected: 0

module.exports = { maxProfit };
