/**
 * ============================================================================
 * PROBLEM: Find All Duplicates in an Array (LeetCode #442)
 * ============================================================================
 * Given an integer array nums of length n where all the integers of nums are
 * in the range [1, n] and each integer appears once or twice, return an array
 * of all the integers that appears twice.
 *
 * You must write an algorithm that runs in O(n) time and uses only constant
 * extra space.
 *
 * Example 1:
 * Input: nums = [4,3,2,7,8,2,3,1]
 * Output: [2,3]
 *
 * Example 2:
 * Input: nums = [1,1,2]
 * Output: [1]
 *
 * Example 3:
 * Input: nums = [1]
 * Output: []
 *
 * Constraints:
 * - n == nums.length
 * - 1 <= n <= 10^5
 * - 1 <= nums[i] <= n
 * - Each element in nums appears once or twice.
 */

// ============================================================================
// APPROACH: Index Marking (In-place Hashing)
// ============================================================================
/**
 * INTUITION:
 * Since the numbers are in the range [1, n], we can use the input array itself
 * as a hash map. The value `x` maps to index `x-1`.
 *
 * We iterate through the array. For each number `x` (taking absolute value):
 * 1. Calculate the target index: `index = abs(x) - 1`.
 * 2. Check the value at `nums[index]`.
 *    - If it's negative, it means we have seen this index before (marked by a previous instance of `x`).
 *      Therefore, `x` is a duplicate.
 *    - If it's positive, we flip it to negative to mark that we have seen `x`.
 *
 * Time Complexity: O(N) - Single pass.
 * Space Complexity: O(1) - We modify the input array in place (output array doesn't count).
 */
const findDuplicates = (nums) => {
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // Use Math.abs because the number might have been negated by a previous step
    const index = Math.abs(nums[i]) - 1;

    // If the number at this index is already negative, we've seen 'index + 1' before
    // This means 'Math.abs(nums[i])' is a duplicate
    if (nums[index] < 0) {
      result.push(Math.abs(nums[i]));
    } else {
      // Mark as seen by negating
      nums[index] = -nums[index];
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Find All Duplicates in an Array Tests ===\n");

console.log("Test 1:", findDuplicates([4, 3, 2, 7, 8, 2, 3, 1])); // Expected: [2, 3]
console.log("Test 2:", findDuplicates([1, 1, 2])); // Expected: [1]
console.log("Test 3:", findDuplicates([1])); // Expected: []

module.exports = { findDuplicates };
