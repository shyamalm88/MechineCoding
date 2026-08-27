// ============================================================================
// APPROACH: DP — Two states (cash: not holding, hold: holding stock)
// ============================================================================
/**
 * STORY / INTUITION:
 * Two states: cash (not holding stock) and hold (holding stock).
 *
 * cash = max(cash, hold + price - fee)  // stay idle OR sell today (minus fee)
 * hold = max(hold, cash - price)        // keep holding OR buy today
 *
 * Fee applied on SELL (not buy). Initial: cash=0, hold=-Infinity.
 *
 * This is the same as Stock II (unlimited) but with a "tax" on each sell.
 * Small sells become unprofitable → we naturally skip small upswings.
 *
 * DRY RUN: prices=[1,3,2,8,4,9], fee=2
 *           cash    hold
 * init:      0     -Inf
 * p=1:       0      -1    (hold=max(-Inf,0-1)=-1)
 * p=3:       0      -1    (cash=max(0,-1+3-2)=0; profit=0, hold unchanged)
 * p=2:       0      -1    (cash=max(0,-1+2-2)=max(0,-1)=0; hold=max(-1,0-2)=-1)
 * p=8:       5      -1    (cash=max(0,-1+8-2)=5; hold=max(-1,0-8)=-1)
 * p=4:       5       1    (cash=max(5,1+4-2)=max(5,3)=5; hold=max(-1,5-4)=1)
 * p=9:       8       1    (cash=max(5,1+9-2)=max(5,8)=8; hold unchanged)
 * Result: cash=8 ✓
 *
 * Time:  O(N)
 * Space: O(1)
 */
const maxProfit = (prices, fee) => {
  let cash = 0;           // max profit when NOT holding
  let hold = -Infinity;   // max profit when holding stock

  for (const price of prices) {
    const prevCash = cash;
    cash = Math.max(cash, hold + price - fee); // sell (apply fee) or stay
    hold = Math.max(hold, prevCash - price);   // buy or keep holding
  }

  return cash;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Best Time to Buy Sell Stock with Fee Tests ===\n");

console.log("Test 1:", maxProfit([1, 3, 2, 8, 4, 9], 2)); // Expected: 8
console.log("Test 2:", maxProfit([1, 3, 7, 5, 10, 3], 3)); // Expected: 6
console.log("Test 3:", maxProfit([1, 2], 1));              // Expected: 0

module.exports = { maxProfit };
