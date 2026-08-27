// ============================================================================
// APPROACH: Binary Search with duplicate handling
// ============================================================================
/**
 * STORY / INTUITION:
 * In #33 (no duplicates), when nums[left] <= nums[mid], LEFT half is sorted.
 * With duplicates, nums[left] == nums[mid] == nums[right] makes it impossible
 * to determine which side is sorted. Solution: shrink both ends (left++, right--).
 *
 * This breaks the guarantee of O(log N) in the worst case → O(N) worst case.
 * (e.g., [1,1,1,1,1,1,0,1] — we might shrink every step)
 *
 * DRY RUN: nums=[2,5,6,0,0,1,2], target=0
 * lo=0,hi=6 → mid=3. nums[3]=0=target → return true ✓
 *
 * DRY RUN (tricky): nums=[1,0,1,1,1], target=0
 * lo=0,hi=4 → mid=2. nums[2]=1. nums[lo]=1 == nums[mid]=1 == nums[hi]=1
 *   → SHRINK: lo=1, hi=3
 * lo=1,hi=3 → mid=2. nums[2]=1. nums[lo]=0 < nums[mid]=1 → left sorted.
 *   0 in [0,1)? Yes! → hi=1
 * lo=1,hi=1 → mid=1. nums[1]=0=target → return true ✓
 *
 * Time:  O(log N) average, O(N) worst case (all duplicates)
 * Space: O(1)
 */
const search = (nums, target) => {
  let lo = 0, hi = nums.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;

    if (nums[mid] === target) return true;

    // Can't determine sorted half when all three equal — shrink both ends
    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
      lo++;
      hi--;
    } else if (nums[lo] <= nums[mid]) {
      // Left half is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }

  return false;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Search in Rotated Sorted Array II Tests ===\n");

console.log("Test 1:", search([2, 5, 6, 0, 0, 1, 2], 0)); // Expected: true
console.log("Test 2:", search([2, 5, 6, 0, 0, 1, 2], 3)); // Expected: false
console.log("Test 3:", search([1, 0, 1, 1, 1], 0));       // Expected: true (tricky!)
console.log("Test 4:", search([1, 1, 1, 1, 1], 2));       // Expected: false

module.exports = { search };
