/**
 * ============================================================================
 * PROBLEM: Squares of a Sorted Array (LeetCode #977)
 * ============================================================================
 * Given an integer array nums sorted in non-decreasing order, return an array
 * of the squares of each number sorted in non-decreasing order.
 *
 * Example 1:
 * Input: nums = [-4,-1,0,3,10]
 * Output: [0,1,9,16,100]
 * Explanation: After squaring, the array becomes [16,1,0,9,100].
 * After sorting, it becomes [0,1,9,16,100].
 *
 * Example 2:
 * Input: nums = [-7,-3,2,3,11]
 * Output: [4,9,9,49,121]
 *
 * Constraints:
 * - 1 <= nums.length <= 10^4
 * - -10^4 <= nums[i] <= 10^4
 * - nums is sorted in non-decreasing order.
 */

// ============================================================================
// APPROACH: Two Pointers (Fill from Back)
// ============================================================================
/**
 * INTUITION:
 * Since the array is sorted, the largest absolute values (and thus the largest squares)
 * are at the ends of the array (either very negative numbers on the left or very
 * positive numbers on the right).
 *
 * We can use two pointers, `left` at 0 and `right` at n-1.
 * We compare abs(nums[left]) and abs(nums[right]).
 * The larger one's square goes to the END of the result array.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N) (Output array)
 */
const sortedSquares = (nums) => {
  const n = nums.length;
  const result = new Array(n);
  let left = 0;
  let right = n - 1;
  let insertPos = n - 1;

  // Fill the result array from the back (largest squares first)
  while (left <= right) {
    const leftVal = Math.abs(nums[left]);
    const rightVal = Math.abs(nums[right]);

    // Compare absolute values to find the larger square
    if (leftVal > rightVal) {
      result[insertPos] = leftVal * leftVal;
      left++;
    } else {
      result[insertPos] = rightVal * rightVal;
      right--;
    }
    insertPos--;
  }

  return result;
};

console.log("=== Squares of a Sorted Array Tests ===\n");
console.log("Test 1:", sortedSquares([-4, -1, 0, 3, 10])); // Expected: [0,1,9,16,100]

module.exports = { sortedSquares };
