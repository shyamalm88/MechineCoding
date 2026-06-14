/**
 * ============================================================================
 * PROBLEM: Subarrays with K Different Integers (LeetCode #992)
 * ============================================================================
 * Given an integer array nums and an integer k, return the number of good
 * subarrays of nums.
 *
 * A good array is an array where the number of DIFFERENT integers in that
 * array is exactly k.
 *
 * Example 1:
 * Input: nums = [1,2,1,2,3], k = 2
 * Output: 7
 * Explanation: Subarrays formed with exactly 2 different integers:
 * [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]
 *
 * Example 2:
 * Input: nums = [1,2,1,3,4], k = 3
 * Output: 3
 * Explanation: Subarrays formed with exactly 3 different integers:
 * [1,2,1,3], [2,1,3], [1,3,4]
 *
 * Constraints:
 * - 1 <= nums.length <= 2 * 10^4
 * - 1 <= nums[i], k <= nums.length
 */

// ============================================================================
// APPROACH: "Exactly K" = atMost(K) - atMost(K - 1)
// ============================================================================
/**
 * STORY / INTUITION:
 * Counting "exactly K distinct" directly is hard — many sub-windows can be
 * valid independently, there's no single grow/shrink boundary like in
 * "longest/shortest" problems.
 *
 * Trick: countExactly(K) = countAtMost(K) - countAtMost(K - 1)
 * "At most K" IS a normal variable-size window: for each right, shrink left
 * while distinct-count > K, then add (right - left + 1) — that's how many
 * subarrays ENDING at `right` are valid (every left position from the
 * current `left` to `right` keeps the window at <= K distinct).
 *
 * DRY RUN — countAtMost(nums=[1,2,1,2,3], K=2):
 * r=0(1): map={1:1}, size=1<=2, total += (0-0+1)=1 → total=1
 * r=1(2): map={1:1,2:1}, size=2<=2, total += (1-0+1)=2 → total=3
 * r=2(1): map={1:2,2:1}, size=2<=2, total += (2-0+1)=3 → total=6
 * r=3(2): map={1:2,2:2}, size=2<=2, total += (3-0+1)=4 → total=10
 * r=4(3): map={1:2,2:2,3:1}, size=3>2 → shrink:
 *   l=0(1): map={1:1,2:2,3:1}, size=3>2 → shrink:
 *   l=1(2): map={1:1,2:1,3:1}, size=3>2 → shrink:
 *   l=2(1): map={2:1,3:1}, size=2<=2. Stop. left=3
 *   total += (4-3+1)=2 → total=12
 * countAtMost(2) = 12
 *
 * Same pass with K=1 gives countAtMost(1) = 5.
 * countExactly(2) = 12 - 5 = 7 ✓
 *
 * Time:  O(N) — each element added/removed from the map at most once
 * Space: O(N) — map can hold up to N distinct values
 */
const subarraysWithKDistinct = (nums, k) => {
  const countAtMost = (limit) => {
    if (limit < 0) return 0;

    const window = new Map(); // value -> count in window
    let left = 0;
    let total = 0;

    for (let right = 0; right < nums.length; right++) {
      const num = nums[right];
      window.set(num, (window.get(num) || 0) + 1);

      while (window.size > limit) {
        const leftNum = nums[left];
        window.set(leftNum, window.get(leftNum) - 1);
        if (window.get(leftNum) === 0) window.delete(leftNum);
        left++;
      }

      total += right - left + 1;
    }

    return total;
  };

  return countAtMost(k) - countAtMost(k - 1);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Subarrays with K Different Integers Tests ===\n");

console.log("Test 1:", subarraysWithKDistinct([1, 2, 1, 2, 3], 2)); // Expected: 7
console.log("Test 2:", subarraysWithKDistinct([1, 2, 1, 3, 4], 3)); // Expected: 3

module.exports = { subarraysWithKDistinct };
