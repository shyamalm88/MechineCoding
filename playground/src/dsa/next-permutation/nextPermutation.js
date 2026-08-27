// ============================================================================
// APPROACH: Single Pass (Find Pivot -> Swap -> Reverse)
// ============================================================================
/**
 * INTUITION:
 * 1. Find the first pair from the right where nums[i] < nums[i+1]. This `i` is the pivot.
 * 2. If no pivot (entirely descending), reverse the whole array (lowest permutation).
 * 3. Else, find the smallest number in the suffix that is larger than nums[i]. Swap them.
 * 4. Reverse the suffix (from i+1 to end) to make it the smallest possible suffix.
 *
 * DRY RUN:
 * Input: nums = [1, 3, 5, 4, 2]
 *
 * 1. Find Pivot:
 *    - Loop runs while nums[i] >= nums[i+1] (skipping descending sequence).
 *    - i=3: 4 >= 2? Yes. Continue loop (i--).
 *    - i=2: 5 >= 4? Yes. Continue loop (i--).
 *    - i=1: 3 >= 5? No. Loop ends. Pivot found at index 1 (value 3).
 *
 * 2. Find Successor:
 *    - Loop runs while nums[j] <= pivot (skipping smaller/equal elements).
 *    - j=4: 2 <= 3? Yes. Continue loop (j--).
 *    - j=3: 4 <= 3? No. Loop ends. Successor found at index 3 (value 4).
 *
 * 3. Swap Pivot and Successor:
 *    - Swap nums[1] and nums[3].
 *    - Array becomes: [1, 4, 5, 3, 2]
 *
 * 4. Reverse Suffix:
 *    - Reverse elements after index 1 (i.e., [5, 3, 2]).
 *    - [5, 3, 2] becomes [2, 3, 5].
 *    - Final Array: [1, 4, 2, 3, 5]
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 *
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place.
 */
var nextPermutation = function (nums) {
  let i = nums.length - 2;

  // 🟢 STEP 1: Find the Pivot (First dip from the right)
  // We look for the first number that is SMALLER than its right neighbor.
  while (i >= 0 && nums[i] >= nums[i + 1]) {
    i--;
  }

  // Check if a pivot was actually found.
  // If i == -1, the array is [3, 2, 1] (Maxed out), so we skip to Step 3.
  if (i >= 0) {
    // 🟢 STEP 2: Find the Successor
    // Look for the smallest number > nums[i] from the right side.
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) {
      j--;
    }

    // Swap them
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  // 🟢 STEP 3: Reverse the Tail
  // The part after 'i' is currently Descending. We flip it to Ascending.
  let left = i + 1;
  let right = nums.length - 1;

  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Next Permutation Tests ===\n");

const test1 = [1, 2, 3];
nextPermutation(test1);
console.log("Test 1:", test1); // Expected: [1, 3, 2]

const test2 = [3, 2, 1];
nextPermutation(test2);
console.log("Test 2:", test2); // Expected: [1, 2, 3]

const test3 = [1, 1, 5];
nextPermutation(test3);
console.log("Test 3:", test3); // Expected: [1, 5, 1]

module.exports = { nextPermutation };
