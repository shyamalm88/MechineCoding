/**
 * ============================================================================
 * PROBLEM: Merge Sorted Array (LeetCode #88)
 * ============================================================================
 * You are given two integer arrays nums1 and nums2, sorted in non-decreasing order,
 * and two integers m and n, representing the number of elements in nums1 and
 * nums2 respectively.
 *
 * Merge nums1 and nums2 into a single array sorted in non-decreasing order.
 *
 * The final sorted array should not be returned by the function, but instead be
 * stored inside the array nums1. To accommodate this, nums1 has a length of m + n,
 * where the first m elements denote the elements that should be merged, and the
 * last n elements are set to 0 and should be ignored.
 *
 * Example 1:
 * Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
 * Output: [1,2,2,3,5,6]
 *
 * Example 2:
 * Input: nums1 = [1], m = 1, nums2 = [], n = 0
 * Output: [1]
 *
 * Constraints:
 * - nums1.length == m + n
 * - nums2.length == n
 * - 0 <= m, n <= 200
 */

// ============================================================================
// APPROACH: Three Pointers (Fill from Back)
// ============================================================================
/**
 * INTUITION:
 * If we iterate from the start, we would need to shift elements in nums1 to make
 * space, which is O(N^2) or requires extra space.
 *
 * However, the end of nums1 is empty (zeros). We can fill the largest elements
 * there without overwriting anything important.
 * We compare the tails of the valid parts of nums1 and nums2, and place the
 * larger one at the end of nums1.
 *
 * Time Complexity: O(M + N)
 * Space Complexity: O(1)
 */
const merge = (nums1, m, nums2, n) => {
  let p1 = m - 1; // Pointer for valid part of nums1
  let p2 = n - 1; // Pointer for nums2
  let p = m + n - 1; // Pointer for the end of nums1 (write position)

  while (p2 >= 0) {
    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }
};

console.log("=== Merge Sorted Array Tests ===\n");
const t1_nums1 = [1, 2, 3, 0, 0, 0];
merge(t1_nums1, 3, [2, 5, 6], 3);
console.log("Test 1:", t1_nums1); // Expected: [1,2,2,3,5,6]

module.exports = { merge };
