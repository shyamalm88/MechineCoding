/**
 * ============================================================================
 * PROBLEM: Product of Array Except Self (LeetCode #238)
 * ============================================================================
 * Given an integer array nums, return an array answer such that answer[i] is
 * equal to the product of all the elements of nums except nums[i].
 *
 * The product of any prefix or suffix of nums is guaranteed to fit in a
 * 32-bit integer.
 *
 * You must write an algorithm that runs in O(n) time and without using the
 * division operation.
 *
 * Example 1:
 * Input: nums = [1,2,3,4]
 * Output: [24,12,8,6]
 *
 * Example 2:
 * Input: nums = [-1,1,0,-3,3]
 * Output: [0,0,9,0,0]
 *
 * Constraints:
 * - 2 <= nums.length <= 10^5
 * - -30 <= nums[i] <= 30
 */

// ============================================================================
// APPROACH: Prefix and Suffix Products
// ============================================================================
/**
 * INTUITION:
 * Instead of dividing the total product by nums[i] (which fails if 0 exists),
 * we calculate:
 * - Left Product: Product of all numbers to the left of i.
 * - Right Product: Product of all numbers to the right of i.
 * Result[i] = LeftProduct[i] * RightProduct[i].
 *
 * We can do this in O(1) space (excluding output array) by using the output
 * array to store left products first, then multiplying by right products on the fly.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1) (Output array doesn't count towards space complexity)
 */
const productExceptSelf = (nums) => {
  const n = nums.length;
  let result = new Array(n);

  // 1. Pass 1: Left Products
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];
  }

  // 2. Pass 2: Right Products (Backwards)
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Product Except Self Tests ===\n");

console.log("Test 1:", productExceptSelf([1, 2, 3, 4]));
// Expected: [24, 12, 8, 6]

console.log("Test 2:", productExceptSelf([-1, 1, 0, -3, 3]));
// Expected: [0, 0, 9, 0, 0]

module.exports = { productExceptSelf };
