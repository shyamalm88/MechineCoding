// ============================================================================
// APPROACH: Dynamic Programming (Tracking Min and Max)
// ============================================================================
/**
 * INTUITION:
 * This is similar to Kadane's algorithm, but with a twist.
 * Since we are dealing with products, a negative number can flip the smallest
 * product (a large negative number) into the largest product.
 *
 * Therefore, we must keep track of both the `maxProd` and `minProd` ending at
 * the current position.
 *
 * At each step, the new max product can come from:
 * 1. The current number itself.
 * 2. The current number * previous max product.
 * 3. The current number * previous min product (if current number is negative).
 *
 * DRY RUN:
 * Input: nums = [-2, 3, -4]
 *
 * 1. Initialize:
 *    - maxProd = -2, minProd = -2, result = -2
 *
 * 2. i=1, x=3:
 *    - prevMax = -2, prevMin = -2
 *    - maxProd = Math.max(3, 3*-2, 3*-2) = 3
 *    - minProd = Math.min(3, 3*-2, 3*-2) = -6
 *    - result = Math.max(-2, 3) = 3
 *
 * 3. i=2, x=-4:
 *    - prevMax = 3, prevMin = -6
 *    - maxProd = Math.max(-4, -4*3, -4*-6) = Math.max(-4, -12, 24) = 24
 *      (Notice how minProd (-6) * negative (-4) became the new max!)
 *    - minProd = Math.min(-4, -4*3, -4*-6) = -12
 *    - result = Math.max(3, 24) = 24
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
const maxProductSubArray = (nums) => {
  let maxProd = nums[0];
  let minProd = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];

    // Store previous values because maxProd is updated before minProd uses it
    const prevMax = maxProd;
    const prevMin = minProd;

    // Candidates for new max/min:
    // 1. Current number alone (starting new subarray)
    // 2. Current number * previous max (extending positive sequence)
    // 3. Current number * previous min (flipping negative sequence to positive)
    maxProd = Math.max(x, x * prevMax, x * prevMin);
    minProd = Math.min(x, x * prevMax, x * prevMin);

    result = Math.max(result, maxProd);
  }
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Maximum Product Subarray Tests ===\n");

console.log("Test 1:", maxProductSubArray([2, 3, -2, 4])); // Expected: 6
console.log("Test 2:", maxProductSubArray([-2, 0, -1])); // Expected: 0
console.log("Test 3:", maxProductSubArray([-2, 3, -4])); // Expected: 24

module.exports = { maxProductSubArray };
