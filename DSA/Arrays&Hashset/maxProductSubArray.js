/**
 * ============================================================================
 * PROBLEM: Maximum Product Subarray (LeetCode #152)
 * ============================================================================
 * Given an integer array nums, find a subarray that has the largest product,
 * and return the product.
 *
 * Example 1:
 * Input: nums = [2,3,-2,4]
 * Output: 6
 * Explanation: [2,3] has the largest product 6.
 *
 * Example 2:
 * Input: nums = [-2,0,-1]
 * Output: 0
 * Explanation: The result cannot be 2, because [-2,-1] is not a subarray.
 *
 * Constraints:
 * - 1 <= nums.length <= 2 * 10^4
 * - -10 <= nums[i] <= 10
 */

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
