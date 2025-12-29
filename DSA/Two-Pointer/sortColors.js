/**
 * ============================================================================
 * PROBLEM: Sort Colors (LeetCode #75)
 * ============================================================================
 * Given an array nums with n objects colored red, white, or blue, sort them
 * in-place so that objects of the same color are adjacent, with the colors
 * in the order red, white, and blue.
 *
 * We will use the integers 0, 1, and 2 to represent the color red, white,
 * and blue, respectively.
 *
 * You must solve this problem without using the library's sort function.
 *
 * Example 1:
 * Input: nums = [2,0,2,1,1,0]
 * Output: [0,0,1,1,2,2]
 *
 * Example 2:
 * Input: nums = [2,0,1]
 * Output: [0,1,2]
 *
 * Constraints:
 * - n == nums.length
 * - 1 <= n <= 300
 * - nums[i] is either 0, 1, or 2.
 */

// ============================================================================
// APPROACH: Three Pointers (Dutch National Flag Algorithm)
// ============================================================================
/**
 * INTUITION:
 * We want to partition the array into three sections:
 * [0s ... 1s ... 2s]
 *
 * We use three pointers:
 * - `low`: The boundary for 0s (everything before `low` is 0).
 * - `mid`: The current element we are inspecting.
 * - `high`: The boundary for 2s (everything after `high` is 2).
 *
 * Logic:
 * - If nums[mid] == 0: Swap with `low`, increment both `low` and `mid`.
 * - If nums[mid] == 1: It's in the correct middle section, just increment `mid`.
 * - If nums[mid] == 2: Swap with `high`, decrement `high`. Do NOT increment `mid`
 *   because the swapped element from `high` hasn't been inspected yet.
 *
 * Time Complexity: O(N) - One pass.
 * Space Complexity: O(1) - In-place.
 */
const sortColors = (nums) => {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      // nums[mid] === 2
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
      // Note: We do NOT increment mid here, because the value swapped
      // from 'high' could be 0, 1, or 2, and needs to be checked.
    }
  }
};

console.log("=== Sort Colors Tests ===\n");
const t1 = [2, 0, 2, 1, 1, 0];
sortColors(t1);
console.log("Test 1:", t1); // Expected: [0,0,1,1,2,2]

const t2 = [2, 0, 1];
sortColors(t2);
console.log("Test 2:", t2); // Expected: [0,1,2]

module.exports = { sortColors };
