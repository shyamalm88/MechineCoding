/**
 * ============================================================================
 * PROBLEM: Pow(x, n) (LeetCode #50)
 * ============================================================================
 * Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).
 *
 * Example 1:
 * Input: x = 2.00000, n = 10
 * Output: 1024.00000
 *
 * Example 2:
 * Input: x = 2.10000, n = 3
 * Output: 9.26100
 *
 * Example 3:
 * Input: x = 2.00000, n = -2
 * Output: 0.25000
 * Explanation: 2^-2 = 1/2^2 = 1/4 = 0.25
 *
 * Constraints:
 * - -100.0 < x < 100.0
 * - -2^31 <= n <= 2^31 - 1
 * - n is an integer.
 * - -10^4 <= x^n <= 10^4
 */

// ============================================================================
// APPROACH: Binary Exponentiation (Iterative)
// ============================================================================
/**
 * INTUITION:
 * Instead of multiplying x by itself n times (which is O(n)), we can use
 * "Exponentiation by Squaring".
 *
 * The idea is:
 * x^n = (x^2)^(n/2)      if n is even
 * x^n = x * (x^2)^((n-1)/2)  if n is odd
 *
 * By squaring the base (x = x * x) and halving the exponent (n = n / 2) at
 * each step, we reduce the problem size logarithmically.
 *
 * Time Complexity: O(log n) - We halve n at every step.
 * Space Complexity: O(1) - We only use a few variables for storage.
 */
const pow = (x, n) => {
  if (n === 0) return 1;

  // Handle negative exponent: x^-n = (1/x)^n
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }

  let result = 1;

  while (n > 0) {
    // If n is odd, multiply the current result by the current base x
    if (n % 2 === 1) {
      result *= x;
    }

    // Square the base and halve the exponent
    x = x * x;
    n = Math.floor(n / 2);
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Pow(x, n) Tests ===\n");
console.log("Test 1 (2^10):", pow(2.0, 10)); // Expected: 1024
console.log("Test 2 (2.1^3):", pow(2.1, 3)); // Expected: ~9.261
console.log("Test 3 (2^-2):", pow(2.0, -2)); // Expected: 0.25

module.exports = { pow };
