/**
 * ============================================================================
 * PROBLEM: Maximum Subarray (LeetCode #53)
 * ============================================================================
 * Given an integer array nums, find the subarray with the largest sum,
 * and return its sum.
 *
 * Example 1:
 * Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
 * Output: 6
 * Explanation: The subarray [4,-1,2,1] has the largest sum 6.
 *
 * Example 2:
 * Input: nums = [1]
 * Output: 1
 *
 * Example 3:
 * Input: nums = [5,4,-1,7,8]
 * Output: 23
 *
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - -10^4 <= nums[i] <= 10^4
 */

// ============================================================================
// APPROACH: Kadane's Algorithm
// ============================================================================
/**
 * INTUITION:
 * We iterate through the array maintaining a running sum (`currentSum`).
 * At each step, we face a choice:
 * 1. Extend the existing subarray by adding the current number.
 * 2. Start a new subarray from the current number (discarding the previous sum).
 *
 * We choose option 2 if the previous running sum was negative (or effectively,
 * if `currentSum + num < num`).
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
const maxSubArray = (nums) => {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Decision: Should we start a new subarray at nums[i] or extend the existing one?
    // If currentSum + nums[i] < nums[i], it means currentSum was negative (dragging us down),
    // so we start fresh from nums[i].
    currentSum = Math.max(currentSum + nums[i], nums[i]);
    // Update global maximum if the new currentSum is higher
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Maximum Subarray Tests ===\n");

console.log("Test 1:", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // Expected: 6
console.log("Test 2:", maxSubArray([1])); // Expected: 1
console.log("Test 3:", maxSubArray([5, 4, -1, 7, 8])); // Expected: 23

module.exports = { maxSubArray };
