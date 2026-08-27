// ============================================================================
// APPROACH: Binary Search on Partition
// ============================================================================
/**
 * STORY / INTUITION:
 * The median splits ALL elements into two equal halves: LEFT half and RIGHT half.
 * We need to find the right partition in each array such that:
 *   - left half of A + left half of B = right half of A + right half of B (by count)
 *   - max(leftA, leftB) <= min(rightA, rightB) (all left elements <= all right)
 *
 * Binary search on the partition index of the SMALLER array (say A).
 * If we cut A at index i, then we cut B at index j = (m+n+1)/2 - i.
 *
 * VISUALIZE (total=8, half=4):
 * A: [1, 3 | 5, 7]    ← partition after index 1 (i=2)
 * B: [2, 4 | 6, 8]    ← partition after index 1 (j=2)
 * leftA=3, leftB=4, rightA=5, rightB=6
 * 3 <= 6 ✓ and 4 <= 5 ✓ → valid partition
 * Median = (max(3,4) + min(5,6)) / 2 = (4+5)/2 = 4.5
 *
 * WHEN TO ADJUST:
 * - leftA > rightB: i too big → hi = i - 1
 * - leftB > rightA: i too small → lo = i + 1
 *
 * EDGE CASES: Use -Infinity/+Infinity for out-of-bound partitions.
 *
 * Time:  O(log(min(m,n)))
 * Space: O(1)
 */
const findMedianSortedArrays = (nums1, nums2) => {
  // Always binary search on the smaller array
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);

  const m = nums1.length, n = nums2.length;
  const half = Math.floor((m + n + 1) / 2);
  let lo = 0, hi = m;

  while (lo <= hi) {
    const i = (lo + hi) >> 1; // partition in nums1
    const j = half - i;       // partition in nums2

    const leftA  = i === 0 ? -Infinity : nums1[i - 1];
    const rightA = i === m ?  Infinity : nums1[i];
    const leftB  = j === 0 ? -Infinity : nums2[j - 1];
    const rightB = j === n ?  Infinity : nums2[j];

    if (leftA <= rightB && leftB <= rightA) {
      // Perfect partition found
      const maxLeft  = Math.max(leftA, leftB);
      const minRight = Math.min(rightA, rightB);
      if ((m + n) % 2 === 1) return maxLeft;
      return (maxLeft + minRight) / 2;
    } else if (leftA > rightB) {
      hi = i - 1; // i is too far right
    } else {
      lo = i + 1; // i is too far left
    }
  }
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Median of Two Sorted Arrays Tests ===\n");

console.log("Test 1:", findMedianSortedArrays([1, 3], [2]));       // Expected: 2.0
console.log("Test 2:", findMedianSortedArrays([1, 2], [3, 4]));    // Expected: 2.5
console.log("Test 3:", findMedianSortedArrays([0, 0], [0, 0]));    // Expected: 0.0
console.log("Test 4:", findMedianSortedArrays([], [1]));            // Expected: 1.0
console.log("Test 5:", findMedianSortedArrays([2], []));            // Expected: 2.0

module.exports = { findMedianSortedArrays };
