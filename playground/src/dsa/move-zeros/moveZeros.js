// ============================================================================
// APPROACH: Two Pointers (Snowball / Partitioning)
// ============================================================================
/**
 * INTUITION:
 * We need to group non-zero elements at the start of the array.
 * We can use two pointers:
 * - `slow`: Points to the position where the next non-zero element should go.
 * - `fast`: Iterates through the array to find non-zero elements.
 *
 * Logic:
 * 1. Iterate `fast` from 0 to n-1.
 * 2. If `nums[fast]` is non-zero:
 *    - Swap `nums[slow]` and `nums[fast]`.
 *    - Increment `slow`.
 * 3. If `nums[fast]` is zero, just continue.
 *
 * By doing this, all non-zero elements are moved to the left (at indices 0 to slow-1),
 * and zeros naturally accumulate to the right.
 *
 * DRY RUN:
 * Input: nums = [0, 1, 0, 3, 12]
 *
 * 1. fast=0 (val=0): Zero. Skip.
 *    Array: [0, 1, 0, 3, 12], slow=0
 *
 * 2. fast=1 (val=1): Non-zero. Swap(0, 1).
 *    Array: [1, 0, 0, 3, 12], slow=1
 *
 * 3. fast=2 (val=0): Zero. Skip.
 *    Array: [1, 0, 0, 3, 12], slow=1
 *
 * 4. fast=3 (val=3): Non-zero. Swap(1, 3).
 *    Array: [1, 3, 0, 0, 12], slow=2
 *
 * 5. fast=4 (val=12): Non-zero. Swap(2, 4).
 *    Array: [1, 3, 12, 0, 0], slow=3
 *
 * Result: [1, 3, 12, 0, 0]
 *
 * Time Complexity: O(N) - One pass.
 * Space Complexity: O(1) - In-place.
 */
function moveZeroes(nums) {
  let slow = 0;

  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Move Zeroes Tests ===\n");

const t1 = [0, 1, 0, 3, 12];
moveZeroes(t1);
console.log("Test 1:", t1); // Expected: [1, 3, 12, 0, 0]

const t2 = [0];
moveZeroes(t2);
console.log("Test 2:", t2); // Expected: [0]

const t3 = [1, 2, 3];
moveZeroes(t3);
console.log("Test 3:", t3); // Expected: [1, 2, 3]

module.exports = { moveZeroes };
