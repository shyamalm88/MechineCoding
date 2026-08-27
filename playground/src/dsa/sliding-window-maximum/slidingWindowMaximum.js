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
 * DRY RUN:
 * Input: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
 *
 * 1. i=0 (val=1): Deque=[0] (val:1)
 * 2. i=1 (val=3): 3 > 1, pop 0. Deque=[1] (val:3)
 * 3. i=2 (val=-1): -1 < 3. Deque=[1, 2] (vals:3, -1).
 *    - Window full. Max=nums[1]=3. Res=[3]
 * 4. i=3 (val=-3): -3 < -1. Deque=[1, 2, 3] (vals:3, -1, -3).
 *    - Check window: deque[0]=1 is valid (1 > 3-3).
 *    - Max=nums[1]=3. Res=[3, 3]
 * 5. i=4 (val=5): 5 > -3 (pop 3), 5 > -1 (pop 2), 5 > 3 (pop 1). Deque=[4] (val:5).
 *    - Max=nums[4]=5. Res=[3, 3, 5]
 * 6. i=5 (val=3): 3 < 5. Deque=[4, 5] (vals:5, 3).
 *    - Max=nums[4]=5. Res=[3, 3, 5, 5]
 * 7. i=6 (val=6): 6 > 3 (pop 5), 6 > 5 (pop 4). Deque=[6] (val:6).
 *    - Max=nums[6]=6. Res=[..., 6]
 * 8. i=7 (val=7): 7 > 6 (pop 6). Deque=[7] (val:7). Max=7. Res=[..., 7]
 *
 * Time Complexity: O(N) - Each element is added and removed at most once.
 * Space Complexity: O(K) - Deque size.
 */
var maxSlidingWindow = function (nums, k) {
  const deque = []; // will store indices
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // 1️⃣ Remove smaller elements from the back
    const lastItem = deque.length - 1;
    while (deque.length > 0 && nums[i] >= nums[deque[lastItem]]) {
      // nums[i] is larger than the element at the back,
      // so the smaller element can never be a max again
      deque.pop();
    }

    // 2️⃣ Add current index
    deque.push(i);

    // 3️⃣ Remove element that slid out of the window
    if (deque[0] <= i - k) {
      // leftmost index is no longer inside window
      deque.shift();
    }

    // 4️⃣ If window is ready, record max
    if (i >= k - 1) {
      // front of deque holds max index
      result.push(nums[deque[0]]);
    }
  }

  return result;
};

console.log("=== Sliding Window Maximum Tests ===\n");
console.log("Test 1:", maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // Expected: [3,3,5,5,6,7]
console.log("Test 2:", maxSlidingWindow([1], 1)); // Expected: [1]

module.exports = { maxSlidingWindow };
