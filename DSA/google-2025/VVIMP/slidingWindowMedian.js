/**
 * ============================================================================
 * PROBLEM: Sliding Window Median (LeetCode #480)
 * CATEGORY: 🔴 HARD / VVIMP (Sorted Window via Binary-Search Insert/Remove)
 * ============================================================================
 * The median is the middle value in an ordered list. If the list size is
 * even, the median is the mean of the two middle values.
 *
 * Given an array `nums` and a window of size `k` sliding from left to right
 * one element at a time, return the median of each window.
 *
 * Example:
 * Input: nums=[1,3,-1,-3,5,3,6,7], k=3
 * Output: [1,-1,-1,3,5,6]
 *
 * Constraints:
 * - 1 <= k <= nums.length <= 2 * 10^4
 * - -2^31 <= nums[i] <= 2^31 - 1
 */

// ============================================================================
// APPROACH: Maintain a Sorted Window, Binary Search for Insert/Remove Points
// ============================================================================
/**
 * STORY / INTUITION:
 * The window only ever holds `k` elements, so we can afford O(k) work per
 * slide. Keep a SORTED copy of the current window. To slide:
 *   1. REMOVE the element leaving the window — binary search for its value
 *      to find its index, then splice it out.
 *   2. INSERT the new element entering the window — binary search for its
 *      sorted position, then splice it in.
 * The median is then just `window[mid]` (odd k) or the average of the two
 * middle elements (even k) — O(1) once the window is sorted.
 *
 * (A two-heap-with-lazy-deletion approach gives a better asymptotic bound,
 * but is notoriously easy to get subtly wrong. For interview-sized k, this
 * sorted-window approach is simpler AND correct — both matter.)
 *
 * DRY RUN: nums=[1,3,-1,-3,5,3,6,7], k=3 (expect [1,-1,-1,3,5,6])
 * window=[1,3,-1].sort() -> [-1,1,3]. median(odd, mid=1) = 1            ✓
 * slide: remove nums[0]=1  -> [-1,3];   insert nums[3]=-3 -> [-3,-1,3]
 *        median = window[1] = -1                                        ✓
 * slide: remove nums[1]=3  -> [-3,-1]; insert nums[4]=5  -> [-3,-1,5]
 *        median = window[1] = -1                                        ✓
 * slide: remove nums[2]=-1 -> [-3,5];  insert nums[5]=3  -> [-3,3,5]
 *        median = window[1] = 3                                         ✓
 * slide: remove nums[3]=-3 -> [3,5];   insert nums[6]=6  -> [3,5,6]
 *        median = window[1] = 5                                         ✓
 * slide: remove nums[4]=5  -> [3,6];   insert nums[7]=7  -> [3,6,7]
 *        median = window[1] = 6                                         ✓
 * Result: [1,-1,-1,3,5,6] ✓
 *
 * Time:  O(N * k) — each slide does O(k) binary search + splice
 * Space: O(k) — the sorted window
 */

// Binary search for the index of `target` in a sorted array (exact match)
const indexOf = (arr, target) => {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
};

// Binary search for the insertion point that keeps the array sorted
const insertPosition = (arr, target) => {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
};

const medianSlidingWindow = (nums, k) => {
  const window = nums.slice(0, k).sort((a, b) => a - b);
  const result = [];

  const getMedian = () => {
    const mid = Math.floor(k / 2);
    return k % 2 === 1 ? window[mid] : (window[mid - 1] + window[mid]) / 2;
  };

  result.push(getMedian());

  for (let i = k; i < nums.length; i++) {
    window.splice(indexOf(window, nums[i - k]), 1);
    window.splice(insertPosition(window, nums[i]), 0, nums[i]);
    result.push(getMedian());
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Sliding Window Median Tests ===\n");

console.log("Test 1:", medianSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // Expected: [1,-1,-1,3,5,6]
console.log("Test 2:", medianSlidingWindow([1, 2, 3, 4, 2, 3, 1, 4, 2], 3)); // Expected: [2,3,3,3,2,3,2]
console.log("Test 3:", medianSlidingWindow([1, 2], 1)); // Expected: [1,2]
console.log("Test 4:", medianSlidingWindow([1, 2, 3, 4], 2)); // Expected: [1.5,2.5,3.5]

module.exports = { medianSlidingWindow };
