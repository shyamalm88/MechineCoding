// ============================================================================
// APPROACH: Dynamic Programming (Bottom-Up)
// ============================================================================
/**
 * INTUITION:
 * To reach step `i`, we could have come from step `i-1` (taking 1 step)
 * or from step `i-2` (taking 2 steps).
 * So, ways[i] = ways[i-1] + ways[i-2].
 * This is exactly the Fibonacci sequence.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N) (Can be optimized to O(1))
 */
const climbingStair = (n) => {
  if (n === 0 || n === 1) return 1;
  const dp = new Array(n + 1);
  dp[0] = 1;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Climbing Stairs Tests ===\n");

console.log("Test 1:", climbingStair(2)); // Expected: 2
console.log("Test 2:", climbingStair(3)); // Expected: 3

module.exports = { climbingStair };
