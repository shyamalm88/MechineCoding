// ============================================================================
// APPROACH: Maintain a Sorted Window, Binary-Search to Insert/Remove
// ============================================================================
/**
 * STORY / INTUITION:
 * A two-heap "lazy deletion" design is the classic textbook answer, but it's
 * fiddly to get right (tracking pending deletions across two heaps with
 * size-balance invariants). For k <= 2000, a much simpler approach is fast
 * enough: keep the current window as a SORTED array.
 *
 * On each slide:
 * - Binary search for the value LEAVING the window and remove it (splice).
 * - Binary search for the insertion point of the value ENTERING the window
 *   and insert it (splice).
 * - The median is then an O(1) lookup at the middle index/indices.
 *
 * DRY RUN: nums = [1,3,-1,-3,5,3,6,7], k = 3
 *  Initial window [1,3,-1] sorted -> [-1,1,3]. median = window[1] = 1
 *  Slide: remove 1 (leaving), insert -3 (entering) -> [-3,-1,3]. median = -1
 *  Slide: remove 3 (leaving), insert 5 (entering)  -> [-3,-1,5]. median = -1
 *  Slide: remove -1 (leaving), insert 3 (entering) -> [-3,3,5]. median = 3
 *  Slide: remove -3 (leaving), insert 6 (entering) -> [3,5,6]. median = 5
 *  Slide: remove 5 (leaving), insert 7 (entering)  -> [3,6,7]. median = 6
 *  Result: [1, -1, -1, 3, 5, 6]
 *
 * Time:  O((N - k) * k) — each slide does O(log k) binary searches but
 *        O(k) splices to shift array elements.
 * Space: O(k) for the sorted window.
 */
const indexOf = (arr, target) => {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
};

const insertPosition = (arr, target) => {
  let lo = 0,
    hi = arr.length;
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

console.log("Test 1:", medianSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
// Expected: [1, -1, -1, 3, 5, 6]

console.log("Test 2:", medianSlidingWindow([1, 2, 3, 4, 2, 3, 1, 4, 2], 3));
// Expected: [2, 3, 3, 3, 2, 3, 2]

console.log("Test 3 (k=1, median is the element itself):", medianSlidingWindow([1, 2], 1));
// Expected: [1, 2]

console.log("Test 4 (even k, average of two middle elements):", medianSlidingWindow([1, 2, 3, 4], 2));
// Expected: [1.5, 2.5, 3.5]

module.exports = { medianSlidingWindow };
