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
