// ============================================================================
// APPROACH: DP — "Unbounded Knapsack with ordered counting"
// ============================================================================
/**
 * STORY / INTUITION:
 * DIFFERENCE FROM COMBINATION SUM (#39): Order matters here.
 * [1,2] and [2,1] are counted separately → this is a PERMUTATION count, not combination.
 *
 * DP: dp[i] = number of ways to reach sum i using any numbers in any order.
 *
 * Transition: To reach sum i, we could have arrived from sum (i - num) for any num in nums.
 *   dp[i] = sum of dp[i - num] for all num where num <= i
 * Base case: dp[0] = 1 (one way to reach 0: pick nothing)
 *
 * KEY DIFFERENCE from Coin Change (#322 - unordered):
 *   In Coin Change, outer loop = coins, inner loop = amount → each coin considered once
 *   Here, outer loop = AMOUNT, inner loop = nums → each amount re-considers all nums
 *   This double-counting is what creates the ordered permutations!
 *
 * DRY RUN: nums=[1,2,3], target=4
 * dp=[1,0,0,0,0]
 * i=1: dp[1] += dp[0](use 1)=1 → dp=[1,1,0,0,0]
 * i=2: dp[2] += dp[1](use 1)=1, dp[0](use 2)=1 → dp=[1,1,2,0,0]
 * i=3: dp[3] += dp[2](use 1)=2, dp[1](use 2)=1, dp[0](use 3)=1 → dp=[1,1,2,4,0]
 * i=4: dp[4] += dp[3](use 1)=4, dp[2](use 2)=2, dp[1](use 3)=1 → dp=[1,1,2,4,7]
 * Result: 7 ✓
 *
 * Time:  O(target * nums.length)
 * Space: O(target)
 */
const combinationSum4 = (nums, target) => {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1; // base case: one way to form sum 0

  for (let i = 1; i <= target; i++) {
    for (const num of nums) {
      if (num <= i) dp[i] += dp[i - num];
    }
  }

  return dp[target];
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Combination Sum IV Tests ===\n");

console.log("Test 1:", combinationSum4([1, 2, 3], 4)); // Expected: 7
console.log("Test 2:", combinationSum4([9], 3));        // Expected: 0
console.log("Test 3:", combinationSum4([1, 2, 3], 3)); // Expected: 4

module.exports = { combinationSum4 };
