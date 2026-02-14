/**
 * ============================================================================
 * PROBLEM: Coin Change II (LeetCode #518)
 * CATEGORY: 🟢 IMPORTANT (Unbounded Knapsack / Counting DP)
 * ============================================================================
 *
 * You are given:
 * - an integer amount
 * - an array of coins (each coin can be used UNLIMITED times)
 *
 * Return the number of COMBINATIONS that make up the amount.
 *
 * Important:
 * - Order of coins does NOT matter
 *   (1+2 and 2+1 are the SAME combination)
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   amount = 5
 *   coins = [1,2,5]
 *
 *   Combinations:
 *     5
 *     2 + 2 + 1
 *     2 + 1 + 1 + 1
 *     1 + 1 + 1 + 1 + 1
 *
 *   Output: 4
 *
 * Example 2:
 *
 *   amount = 3
 *   coins = [2]
 *
 *   Output: 0
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 0 <= amount <= 5000
 * - 1 <= coins.length <= 300
 *
 * ============================================================================
 * INTUITION: Why This Is NOT Coin Change I
 * ============================================================================
 *
 * Coin Change I asks:
 *   → minimum number of coins
 *
 * Coin Change II asks:
 *   → number of ways (COUNTING)
 *
 * Key Insight (VERY IMPORTANT):
 *
 *   We are counting COMBINATIONS, not permutations.
 *
 * That means:
 *   - [1,2] and [2,1] must NOT be counted separately
 *
 * This single requirement changes EVERYTHING about the DP.
 *
 * ============================================================================
 * DP STATE DEFINITION
 * ============================================================================
 *
 * Let:
 *   dp[x] = number of ways to make amount x
 *
 * Our goal:
 *   dp[amount]
 *
 * Base Case:
 *   dp[0] = 1
 *
 * Why?
 * - There is exactly ONE way to make amount 0:
 *   → choose nothing
 *
 * ============================================================================
 * DP TRANSITION (CORE IDEA)
 * ============================================================================
 *
 * For each coin:
 *   for all amounts >= coin:
 *     dp[x] += dp[x - coin]
 *
 * Interpretation:
 * - To form amount x using coin c:
 *     → append coin c to every way of forming (x - c)
 *
 * ============================================================================
 * THE MOST IMPORTANT DETAIL (INTERVIEW TRAP)
 * ============================================================================
 *
 * ORDER OF LOOPS MATTERS.
 *
 * Correct:
 *   for coin in coins:
 *     for x from coin → amount
 *
 * Incorrect:
 *   for x from 0 → amount:
 *     for coin in coins
 *
 * Why?
 *
 * - Coin-first loop ensures each combination is counted ONCE
 * - Amount-first loop counts permutations (WRONG)
 *
 * This is the #1 mistake candidates make.
 *
 * ============================================================================
 * MENTAL MODEL
 * ============================================================================
 *
 * Think like this:
 *
 *   “I am deciding how many times I use coin 1,
 *    then coin 2,
 *    then coin 5…”
 *
 * Once I move past a coin,
 * I NEVER go back to smaller coins.
 *
 * That guarantees uniqueness.
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * 1. Initialize dp array of size amount + 1
 * 2. dp[0] = 1
 * 3. For each coin:
 *      for x = coin → amount:
 *         dp[x] += dp[x - coin]
 * 4. Return dp[amount]
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - N = number of coins
 * - A = amount
 *
 * Time:  O(N × A)
 * Space: O(A)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🟢 IMPORTANT
 * ============================================================================
 *
 * Interviewers are testing:
 * - Do you understand combinations vs permutations?
 * - Do you know WHY loop order matters?
 * - Can you explain dp[0] = 1 properly?
 *
 * This problem is a FOUNDATION for many DP variants.
 * ============================================================================
 */

function change(amount, coins) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;

  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] += dp[x - coin];
    }
  }

  return dp[amount];
}
