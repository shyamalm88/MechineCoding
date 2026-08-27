// ============================================================================
// APPROACH: Binary Search (Find Sorted Half)
// ============================================================================
/**
 * INTUITION:
 * In a rotated sorted array, at least one half (left or right) is always sorted.
 * 1. Find Mid.
 * 2. Check if Left side is sorted (nums[left] <= nums[mid]).
 *    - If yes, check if target is in that range. If so, go Left. Else go Right.
 * 3. Else (Right side must be sorted).
 *    - Check if target is in that range. If so, go Right. Else go Left.
 *
 * Time Complexity: O(log N)
 * Space Complexity: O(1)
 */
var searchInRotatedSortedArray = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // 🟢 STEP 1: Find the Sorted Half
    if (nums[left] <= nums[mid]) {
      // LEFT is Sorted

      // 🟢 STEP 2: Is target inside this sorted range?
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // Yes, go Left
      } else {
        left = mid + 1; // No, go Right
      }
    } else {
      // RIGHT is Sorted (Implied)

      // 🟢 STEP 2: Is target inside this sorted range?
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1; // Yes, go Right
      } else {
        right = mid - 1; // No, go Left
      }
    }
  }
  return -1;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Search in Rotated Sorted Array Tests ===\n");

console.log("Test 1:", searchInRotatedSortedArray([4, 5, 6, 7, 0, 1, 2], 0)); // Expected: 4
console.log("Test 2:", searchInRotatedSortedArray([4, 5, 6, 7, 0, 1, 2], 3)); // Expected: -1
console.log("Test 3:", searchInRotatedSortedArray([1], 0)); // Expected: -1

module.exports = { searchInRotatedSortedArray };
