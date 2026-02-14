/**
 * ============================================================================
 * PROBLEM: Partition Equal Subset Sum (LeetCode #416)
 * CATEGORY: 🟢 IMPORTANT (0/1 Knapsack → Boolean DP)
 * ============================================================================
 *
 * You are given an array of positive integers nums.
 *
 * Determine if the array can be partitioned into TWO subsets
 * such that the SUM of elements in both subsets is equal.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   nums = [1,5,11,5]
 *
 *   Total sum = 22
 *   Target = 11
 *
 *   Possible partition:
 *     [1,5,5]  → sum = 11
 *     [11]     → sum = 11
 *
 *   Output: true
 *
 * Example 2:
 *
 *   nums = [1,2,3,5]
 *
 *   Total sum = 11 (odd)
 *   Output: false
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= nums.length <= 200
 * - 1 <= nums[i] <= 100
 *
 * ============================================================================
 * INTUITION: Reduce the Problem First
 * ============================================================================
 *
 * The key move is to SIMPLIFY the question.
 *
 * We are NOT really asking:
 *   “Can I split into two equal subsets?”
 *
 * We ARE asking:
 *   “Can I find ONE subset with sum = totalSum / 2?”
 *
 * Why this works:
 * - If one subset sums to target,
 *   the rest automatically sum to target as well.
 *
 * First sanity check:
 * - If totalSum is ODD → impossible.
 *
 * ============================================================================
 * DP PATTERN IDENTIFICATION
 * ============================================================================
 *
 * This is a classic:
 *   ➤ 0/1 Knapsack (each number used at most once)
 *
 * Differences from Coin Change II:
 * - Coin Change II → UNBOUNDED
 * - Here → EACH number used ONCE
 *
 * ============================================================================
 * DP STATE DEFINITION
 * ============================================================================
 *
 * Let:
 *   dp[s] = true if we can form sum `s` using some of the numbers
 *
 * Goal:
 *   dp[target] === true
 *
 * Base Case:
 *   dp[0] = true
 *
 * Why?
 * - We can always form sum 0 by choosing nothing.
 *
 * ============================================================================
 * DP TRANSITION (CORE IDEA)
 * ============================================================================
 *
 * For each number num:
 *   for s from target down to num:
 *     dp[s] = dp[s] OR dp[s - num]
 *
 * Interpretation:
 * - Either:
 *     we don’t use `num`
 *   OR
 *     we use `num` and see if (s - num) was achievable before
 *
 * ============================================================================
 * THE MOST IMPORTANT DETAIL (INTERVIEW TRAP)
 * ============================================================================
 *
 * Loop direction MUST be BACKWARD.
 *
 * Why?
 * - Backward loop ensures each number is used AT MOST ONCE
 *
 * If you loop forward:
 * - You allow the same number to be reused multiple times ❌
 *
 * This is the defining difference between:
 * - Unbounded knapsack
 * - 0/1 knapsack
 *
 * ============================================================================
 * MENTAL MODEL
 * ============================================================================
 *
 * Think like this:
 *
 *   “After processing the first i numbers,
 *    what sums can I form?”
 *
 * Each number gives you ONE chance to update the dp array.
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * 1. Compute totalSum
 * 2. If totalSum is odd → return false
 * 3. target = totalSum / 2
 * 4. dp[0] = true
 * 5. For each num in nums:
 *      for s = target → num:
 *         dp[s] |= dp[s - num]
 * 6. Return dp[target]
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - N = nums.length
 * - T = target = totalSum / 2
 *
 * Time:  O(N × T)
 * Space: O(T)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🟢 IMPORTANT
 * ============================================================================
 *
 * Interviewers are testing:
 * - Can you reduce problems cleanly?
 * - Do you know 0/1 knapsack?
 * - Do you understand loop direction importance?
 *
 * This problem appears in MANY disguises.
 * ============================================================================
 */

function canPartition(nums) {
  const totalSum = nums.reduce((a, b) => a + b, 0);
  if (totalSum % 2 !== 0) return false;

  const target = totalSum / 2;
  const dp = Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let s = target; s >= num; s--) {
      dp[s] = dp[s] || dp[s - num];
    }
  }

  return dp[target];
}
