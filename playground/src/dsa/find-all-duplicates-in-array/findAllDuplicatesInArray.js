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
 * DRY RUN:
 * Input: nums = [4, 3, 2, 7, 8, 2, 3, 1]
 *
 * 1. i=0, val=4:
 *    - index = 3. nums[3] (7) > 0. Flip to -7.
 *    - Array: [4, 3, 2, -7, 8, 2, 3, 1]
 *
 * 2. i=1, val=3:
 *    - index = 2. nums[2] (2) > 0. Flip to -2.
 *    - Array: [4, 3, -2, -7, 8, 2, 3, 1]
 *
 * 3. i=2, val=2 (abs(-2)):
 *    - index = 1. nums[1] (3) > 0. Flip to -3.
 *    - Array: [4, -3, -2, -7, 8, 2, 3, 1]
 *
 * 4. i=3, val=7 (abs(-7)):
 *    - index = 6. nums[6] (3) > 0. Flip to -3.
 *    - Array: [4, -3, -2, -7, 8, 2, -3, 1]
 *
 * 5. i=4, val=8:
 *    - index = 7. nums[7] (1) > 0. Flip to -1.
 *    - Array: [4, -3, -2, -7, 8, 2, -3, -1]
 *
 * 6. i=5, val=2:
 *    - index = 1. nums[1] (-3) < 0. SEEN BEFORE!
 *    - Add 2 to result. Result: [2]
 *
 * 7. i=6, val=3:
 *    - index = 2. nums[2] (-2) < 0. SEEN BEFORE!
 *    - Add 3 to result. Result: [2, 3]
 *
 * 8. i=7, val=1 (abs(-1)):
 *    - index = 0. nums[0] (4) > 0. Flip to -4.
 *
 * Result: [2, 3]
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
