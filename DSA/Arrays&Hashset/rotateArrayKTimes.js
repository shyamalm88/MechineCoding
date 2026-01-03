/**
 * ============================================================================
 * PROBLEM: Rotate Array (LeetCode #189)
 * ============================================================================
 * Given an integer array nums, rotate the array to the right by k steps,
 * where k is non-negative.
 *
 * Example 1:
 * Input: nums = [1,2,3,4,5,6,7], k = 3
 * Output: [5,6,7,1,2,3,4]
 *
 * Example 2:
 * Input: nums = [-1,-100,3,99], k = 2
 * Output: [3,99,-1,-100]
 *
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - 0 <= k <= 10^5
 */

// ============================================================================
// APPROACH: Reverse Strategy
// ============================================================================
/**
 * INTUITION:
 * To rotate an array by k elements to the right, we can perform three reversals:
 * 1. Reverse the entire array.
 *    [1,2,3,4,5,6,7] -> [7,6,5,4,3,2,1]
 * 2. Reverse the first k elements.
 *    [7,6,5] -> [5,6,7]
 * 3. Reverse the remaining n-k elements.
 *    [4,3,2,1] -> [1,2,3,4]
 * Result: [5,6,7,1,2,3,4]
 *
 * This works because reversing the whole array puts the last k elements at the
 * front (but in reverse order) and the first n-k elements at the back (in reverse order).
 * Reversing the individual parts fixes their internal order.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1) - In-place.
 */
const rotate = (nums, k) => {
  const n = nums.length;
  // Normalize k in case k > n
  k = k % n;

  const reverse = (l, r) => {
    while (l < r) {
      [nums[l], nums[r]] = [nums[r], nums[l]];
      l++;
      r--;
    }
  };
  // 1. Reverse the entire array
  reverse(0, n - 1);
  // 2. Reverse the first k elements (which were originally at the end)
  reverse(0, k - 1);
  // 3. Reverse the remaining elements (which were originally at the start)
  reverse(k, n - 1);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Rotate Array Tests ===\n");

const test1 = [1, 2, 3, 4, 5, 6, 7];
rotate(test1, 3);
console.log("Test 1:", test1); // Expected: [5, 6, 7, 1, 2, 3, 4]

const test2 = [-1, -100, 3, 99];
rotate(test2, 2);
console.log("Test 2:", test2); // Expected: [3, 99, -1, -100]

module.exports = { rotate };
