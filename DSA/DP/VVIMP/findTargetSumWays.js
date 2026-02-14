/**
 * ============================================================================
 * PROBLEM: Target Sum (LeetCode #494)
 * CATEGORY: 🔴 VVIMP (DP via Problem Transformation)
 * ============================================================================
 *
 * You are given an array of integers nums and an integer target.
 *
 * You can assign either:
 *   '+' or '-'
 * in front of each number.
 *
 * Return the number of DIFFERENT expressions that evaluate to target.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   nums = [1,1,1,1,1]
 *   target = 3
 *
 *   Expressions:
 *     +1 +1 +1 +1 -1
 *     +1 +1 +1 -1 +1
 *     +1 +1 -1 +1 +1
 *     +1 -1 +1 +1 +1
 *     -1 +1 +1 +1 +1
 *
 *   Output: 5
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= nums.length <= 20
 * - 0 <= nums[i] <= 1000
 *
 * ============================================================================
 * INTUITION: Why Signs Are Misleading
 * ============================================================================
 *
 * At first glance, this looks like:
 *   “Try all + / - combinations”
 *
 * That’s exponential brute force.
 *
 * Key Insight (CRITICAL):
 *
 *   The signs partition numbers into TWO groups:
 *     - P (positive)
 *     - N (negative)
 *
 * Let:
 *   sum(P) - sum(N) = target
 *
 * Also:
 *   sum(P) + sum(N) = totalSum
 *
 * ============================================================================
 * PROBLEM TRANSFORMATION (THE KEY STEP)
 * ============================================================================
 *
 * Add both equations:
 *
 *   2 × sum(P) = target + totalSum
 *
 * So:
 *
 *   sum(P) = (target + totalSum) / 2
 *
 * This transforms the problem into:
 *
 *   “How many subsets have sum = sum(P)?”
 *
 * Which is a CLASSIC 0/1 KNAPSACK COUNTING problem.
 *
 * ============================================================================
 * SANITY CHECKS (IMPORTANT)
 * ============================================================================
 *
 * If:
 * - target + totalSum < 0
 * - (target + totalSum) is odd
 *
 * → return 0
 *
 * ============================================================================
 * DP STATE DEFINITION
 * ============================================================================
 *
 * Let:
 *   dp[s] = number of ways to form sum s
 *
 * Goal:
 *   dp[sum(P)]
 *
 * ============================================================================
 * DP TRANSITION
 * ============================================================================
 *
 * For each number num:
 *   for s from targetSum → num:
 *     dp[s] += dp[s - num]
 *
 * This ensures:
 * - Each number used at most once
 * - Counting combinations correctly
 *
 * ============================================================================
 * BASE CASE
 * ============================================================================
 *
 * dp[0] = 1
 *
 * Meaning:
 * - There is exactly one way to form sum 0:
 *   choose nothing
 *
 * ============================================================================
 * MENTAL MODEL
 * ============================================================================
 *
 * You are NOT choosing signs.
 * You are choosing WHICH numbers go into the positive group.
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * 1. Compute totalSum
 * 2. Compute requiredSum = (target + totalSum) / 2
 * 3. Validate requiredSum
 * 4. Run 0/1 knapsack count DP
 * 5. Return dp[requiredSum]
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - N = nums.length
 * - S = requiredSum
 *
 * Time:  O(N × S)
 * Space: O(S)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔴 VVIMP
 * ============================================================================
 *
 * Interviewers are testing:
 * - Can you transform problems mathematically?
 * - Can you reduce exponential brute force to DP?
 * - Do you recognize knapsack patterns?
 *
 * This is a SIGNATURE Google DP problem.
 * ============================================================================
 */

function findTargetSumWays(nums, target) {
  const totalSum = nums.reduce((a, b) => a + b, 0);

  if (target + totalSum < 0 || (target + totalSum) % 2 !== 0) {
    return 0;
  }

  const requiredSum = (target + totalSum) / 2;

  const dp = Array(requiredSum + 1).fill(0);
  dp[0] = 1;

  for (const num of nums) {
    for (let s = requiredSum; s >= num; s--) {
      dp[s] += dp[s - num];
    }
  }

  return dp[requiredSum];
}
