// ============================================================================
// APPROACH: Binary Search for the Left Edge of a Size-K Window
// ============================================================================
/**
 * STORY / INTUITION:
 * The answer is always a CONTIGUOUS window of size k inside `arr` (since arr
 * is sorted, the k closest values to x must be consecutive). So instead of
 * searching for individual elements, binary search for the window's LEFT
 * boundary directly — there are only `n - k + 1` possible windows.
 *
 * For a candidate left boundary `mid`, the window is `arr[mid .. mid+k-1]`.
 * Compare the element just OUTSIDE the window on each side:
 *   - `arr[mid]`     is the leftmost element of this window
 *   - `arr[mid + k]` is the first element just past the window
 * If `x - arr[mid] > arr[mid+k] - x`, the element on the right side
 * (arr[mid+k]) is STRICTLY closer to x than arr[mid] is — so the window
 * should shift right (the current left edge is too far from x). Otherwise,
 * the current window (or one further left) is at least as good — shrink
 * the search space from the right.
 *
 * This binary search narrows `[left, right]` (right = n - k, the max valid
 * start index) down to a single index — the optimal window start.
 *
 * DRY RUN: arr=[1,1,2,3,4,5,6,7,8], k=3, x=5  (expect [4,5,6])
 * left=0, right=9-3=6
 * mid=3: x-arr[3]=5-3=2,   arr[6]-x=6-5=1   -> 2>1 true  -> left=4
 * mid=5: x-arr[5]=5-5=0,   arr[8]-x=8-5=3   -> 0>3 false -> right=5
 * mid=4: x-arr[4]=5-4=1,   arr[7]-x=7-5=2   -> 1>2 false -> right=4
 * left==right==4 -> arr.slice(4,7) = [4,5,6] ✓
 *
 * Time:  O(log(n-k) + k) — binary search over window starts, then slice
 * Space: O(k) — the output array
 */
const findClosestElements = (arr, k, x) => {
  let left = 0;
  let right = arr.length - k;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (x - arr[mid] > arr[mid + k] - x) {
      left = mid + 1; // right side is strictly closer, shift window right
    } else {
      right = mid; // current (or further left) window is at least as good
    }
  }

  return arr.slice(left, left + k);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Find K Closest Elements Tests ===\n");

console.log("Test 1:", findClosestElements([1, 2, 3, 4, 5], 4, 3)); // Expected: [1,2,3,4]
console.log("Test 2:", findClosestElements([1, 2, 3, 4, 5], 4, -1)); // Expected: [1,2,3,4]
console.log("Test 3:", findClosestElements([1, 1, 2, 3, 4, 5, 6, 7, 8], 3, 5)); // Expected: [4,5,6]
console.log("Test 4:", findClosestElements([1, 2, 3, 4, 5], 1, 3)); // Expected: [3]

module.exports = { findClosestElements };
