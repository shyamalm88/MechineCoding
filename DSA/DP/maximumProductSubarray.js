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
// APPROACH: Dynamic Programming (Track Min & Max)
// ============================================================================
/**
 * INTUITION:
 * Unlike sum, where we only care about the max, with products a negative number
 * can flip the sign. A large negative product multiplied by a negative number
 * becomes a large positive product.
 *
 * Therefore, at each step, we must keep track of:
 * 1. currentMax: The max product ending at this position.
 * 2. currentMin: The min product ending at this position (in case we hit a negative).
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
const maxProduct = (nums) => {
  if (nums.length === 0) return 0;

  let maxSoFar = nums[0];
  let minSoFar = nums[0];
  let result = maxSoFar;

  for (let i = 1; i < nums.length; i++) {
    const curr = nums[i];

    // We need temp variables because maxSoFar is updated before calculating minSoFar
    const tempMax = Math.max(curr, Math.max(maxSoFar * curr, minSoFar * curr));
    const tempMin = Math.min(curr, Math.min(maxSoFar * curr, minSoFar * curr));

    maxSoFar = tempMax;
    minSoFar = tempMin;

    result = Math.max(result, maxSoFar);
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Maximum Product Subarray Tests ===\n");

console.log("Test 1:", maxProduct([2, 3, -2, 4])); // Expected: 6
console.log("Test 2:", maxProduct([-2, 0, -1])); // Expected: 0
console.log("Test 3:", maxProduct([-2, 3, -4])); // Expected: 24

module.exports = { maxProduct };
