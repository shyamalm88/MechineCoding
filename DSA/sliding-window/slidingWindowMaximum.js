/**
 * ============================================================================
 * PROBLEM: Sliding Window Maximum (LeetCode #239)
 * ============================================================================
 * You are given an array of integers nums, there is a sliding window of size k
 * which is moving from the very left of the array to the very right. You can
 * only see the k numbers in the window. Each time the sliding window moves right
 * by one position.
 *
 * Return the max sliding window.
 *
 * Example 1:
 * Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
 * Output: [3,3,5,5,6,7]
 * Explanation:
 * Window position                Max
 * ---------------               -----
 * [1  3  -1] -3  5  3  6  7       3
 *  1 [3  -1  -3] 5  3  6  7       3
 *  1  3 [-1  -3  5] 3  6  7       5
 *  1  3  -1 [-3  5  3] 6  7       5
 *  1  3  -1  -3 [5  3  6] 7       6
 *  1  3  -1  -3  5 [3  6  7]      7
 *
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - -10^4 <= nums[i] <= 10^4
 * - 1 <= k <= nums.length
 */

// ============================================================================
// APPROACH: Monotonic Decreasing Queue (Deque)
// ============================================================================
/**
 * INTUITION:
 * We need the max of the current window in O(1) time.
 * A simple queue doesn't help. A heap takes O(log k).
 * We use a Deque (Double-ended queue) to store *indices*.
 *
 * The Deque will maintain indices of elements in decreasing order of their values.
 * - Front of Deque: Index of the largest element in the current window.
 * - When adding a new element `nums[i]`:
 *   1. Remove indices from the BACK that are smaller than `nums[i]` (they are useless now).
 *   2. Remove indices from the FRONT that are out of the window (index <= i - k).
 *   3. Add `i` to the BACK.
 *   4. If window size reached (i >= k - 1), add `nums[deque[0]]` to result.
 *
 * Time Complexity: O(N) - Each element is added and removed at most once.
 * Space Complexity: O(K) - Deque size.
 */
const maxSlidingWindow = (nums, k) => {
  const deque = []; // Stores indices
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // 1. Remove elements out of the current window from the front
    // The window is [i - k + 1, i]. If deque[0] < i - k + 1, it's gone.
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }

    // 2. Maintain Monotonic Decreasing property
    // Remove elements from the back that are smaller than the current element
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }

    // 3. Add current index
    deque.push(i);

    // 4. Add max to result (only if window is fully formed)
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
};

console.log("=== Sliding Window Maximum Tests ===\n");
console.log("Test 1:", maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // Expected: [3,3,5,5,6,7]
console.log("Test 2:", maxSlidingWindow([1], 1)); // Expected: [1]

module.exports = { maxSlidingWindow };
