// ============================================================================
// APPROACH: Binary Search
// ============================================================================
/**
 * INTUITION:
 * We can view the array as a series of ascending and descending slopes.
 * If we pick a middle element `mid` and compare it with its right neighbor `mid + 1`:
 * 1. If nums[mid] > nums[mid+1]: We are on a descending slope. Since the left boundary
 *    starts at -∞, there must be a peak to the left (or at `mid`).
 * 2. If nums[mid] < nums[mid+1]: We are on an ascending slope. Since the right boundary
 *    ends at -∞, there must be a peak to the right.
 *
 * Time Complexity: O(log N)
 * Space Complexity: O(1)
 */
const findPeakElement = (nums) => {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    let mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[mid + 1]) {
      // Descending slope, peak is on the left (or is mid)
      right = mid;
    } else {
      // Ascending slope, peak is on the right
      left = mid + 1;
    }
  }
  return left;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Find Peak Element Tests ===\n");
console.log("Test 1:", findPeakElement([1, 2, 3, 1])); // Expected: 2
console.log("Test 2:", findPeakElement([1, 2, 1, 3, 5, 6, 4])); // Expected: 5 (or 1)
console.log("Test 3:", findPeakElement([1])); // Expected: 0

module.exports = { findPeakElement };
