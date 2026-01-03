/**
 * ============================================================================
 * PROBLEM: Remove Duplicates from Sorted Array II (LeetCode #80)
 * ============================================================================
 * Given an integer array nums sorted in non-decreasing order, remove some
 * duplicates in-place such that each unique element appears at most twice.
 * The relative order of the elements should be kept the same.
 *
 * Return k after placing the final result in the first k slots of nums.
 *
 * Example 1:
 * Input: nums = [1,1,1,2,2,3]
 * Output: 5, nums = [1,1,2,2,3,_]
 * Explanation: Your function should return k = 5, with the first five elements
 * being 1, 1, 2, 2, and 3 respectively.
 *
 * Example 2:
 * Input: nums = [0,0,1,1,1,1,2,3,3]
 * Output: 7, nums = [0,0,1,1,2,3,3,_,_]
 *
 * Constraints:
 * - 1 <= nums.length <= 3 * 10^4
 * - nums is sorted in non-decreasing order.
 */

// ============================================================================
// APPROACH: Two Pointers (Read/Write)
// ============================================================================
/**
 * INTUITION:
 * We need a pointer `insertIndex` that tells us where to write the next valid number.
 * We iterate through the array with `i`.
 *
 * A number is valid to keep if:
 * 1. We haven't filled 2 spots yet (insertIndex < 2).
 * 2. OR, the number is different from the one located 2 spots back (nums[insertIndex-2]).
 *    (Since the array is sorted, if nums[i] > nums[insertIndex-2], it means we haven't
 *    used this number twice yet).
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
const removeDuplicates = (nums) => {
  if (nums.length <= 2) return nums.length;

  // Start from index 2, as the first two elements are always allowed
  let insertIndex = 2;

  for (let i = 2; i < nums.length; i++) {
    // Check if the current number is different from the number two positions back.
    // If it is, it means we haven't used this number more than twice yet.
    if (nums[i] !== nums[insertIndex - 2]) {
      nums[insertIndex] = nums[i];
      insertIndex++;
    }
  }

  return insertIndex;
};

console.log("=== Remove Duplicates II Tests ===\n");
const t1 = [1, 1, 1, 2, 2, 3];
const k1 = removeDuplicates(t1);
console.log("Test 1:", k1, t1.slice(0, k1)); // Expected: 5, [1,1,2,2,3]

module.exports = { removeDuplicates };
