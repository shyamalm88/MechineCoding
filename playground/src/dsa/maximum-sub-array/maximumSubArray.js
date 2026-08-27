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
 * DRY RUN:
 * Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 *
 * 1. Initialize: currentSum = -2, maxSum = -2
 *
 * 2. i=1, num=1:
 *    - currentSum = Math.max(1, -2 + 1) = 1. (Start new subarray)
 *    - maxSum = Math.max(-2, 1) = 1.
 *
 * 3. i=2, num=-3:
 *    - currentSum = Math.max(-3, 1 - 3) = -2. (Extend)
 *    - maxSum = 1.
 *
 * 4. i=3, num=4:
 *    - currentSum = Math.max(4, -2 + 4) = 4. (Start new)
 *    - maxSum = 4.
 *
 * 5. i=4, num=-1:
 *    - currentSum = Math.max(-1, 4 - 1) = 3. (Extend)
 *    - maxSum = 4.
 *
 * 6. i=5, num=2:
 *    - currentSum = Math.max(2, 3 + 2) = 5. (Extend)
 *    - maxSum = 5.
 *
 * 7. i=6, num=1:
 *    - currentSum = Math.max(1, 5 + 1) = 6. (Extend)
 *    - maxSum = 6.
 *
 * Result: 6 (Subarray [4, -1, 2, 1])
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
