/**
 * ============================================================================
 * PROBLEM: Find Minimum in Rotated Sorted Array (LeetCode #153)
 * ============================================================================
 * Suppose an array of length n sorted in ascending order is rotated between
 * 1 and n times. Given the sorted rotated array nums of unique elements,
 * return the minimum element of this array.
 *
 * You must write an algorithm that runs in O(log n) time.
 *
 * Example 1:
 * Input: nums = [3,4,5,1,2]
 * Output: 1
 *
 * Example 2:
 * Input: nums = [4,5,6,7,0,1,2]
 * Output: 0
 *
 * Constraints:
 * - n == nums.length
 * - 1 <= n <= 5000
 * - All the integers of nums are unique.
 */

// ============================================================================
// APPROACH: Binary Search
// ============================================================================
/**
 * INTUITION:
 * We want to find the "pivot" point where the order resets.
 * We compare `mid` with `right`.
 * - If nums[mid] > nums[right], the minimum must be to the right of mid (e.g., [3,4,5,1,2], mid=5, right=2).
 * - If nums[mid] < nums[right], the minimum is either mid or to the left (e.g., [5,1,2,3,4], mid=2, right=4).
 *
 * Time Complexity: O(log N)
 * Space Complexity: O(1)
 *
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  let left = 0;
  let right = nums.length - 1;

  // Use left < right (Stop when they meet)
  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Compare Mid with Right
    if (nums[mid] > nums[right]) {
      // The slope is broken. Min is to the Right.
      left = mid + 1;
    } else {
      // The slope is correct (Mid < Right).
      // Min could be Mid, or to the Left.
      // We cannot discard Mid, so we set right = mid
      right = mid;
    }
  }

  // When left == right, we found the smallest element
  return nums[left];
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Find Minimum in Rotated Sorted Array Tests ===\n");

console.log("Test 1:", findMin([3, 4, 5, 1, 2])); // Expected: 1
console.log("Test 2:", findMin([4, 5, 6, 7, 0, 1, 2])); // Expected: 0
console.log("Test 3:", findMin([11, 13, 15, 17])); // Expected: 11

module.exports = { findMin };
