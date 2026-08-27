// ============================================================================
// APPROACH: Prefix Sums + Monotonic Increasing Deque of indices
// ============================================================================
/**
 * STORY / INTUITION:
 * With negative numbers, a normal sliding window breaks: growing the window
 * doesn't monotonically grow the sum, so "shrink while sum >= k" no longer
 * makes sense. The fix is to work with PREFIX SUMS instead of raw values.
 *
 * prefix[j] - prefix[i] = sum(nums[i..j-1])
 *
 * We want the SHORTEST (j - i) such that prefix[j] - prefix[i] >= k, i.e.
 * prefix[i] <= prefix[j] - k. For a fixed j, we want the LARGEST valid i
 * (closest to j) — that gives the shortest length.
 *
 * Keep a deque of indices whose prefix sums are STRICTLY INCREASING:
 *
 * - Before pushing index j, pop any index from the BACK whose prefix sum
 *   is >= prefix[j]. Those indices are now USELESS — j is both closer
 *   (shorter subarray) AND has a smaller-or-equal prefix sum (easier to
 *   satisfy "prefix[i] <= prefix[j] - k" for future j's). This keeps the
 *   deque monotonically increasing in prefix-sum value.
 *
 * - While the FRONT of the deque satisfies prefix[j] - prefix[front] >= k,
 *   we found a valid subarray (front..j). Record its length and pop the
 *   front — once consumed by this j, an EARLIER j' < j would only give a
 *   longer subarray with the same front, so the front is useless going
 *   forward too.
 *
 * DRY RUN: nums = [2,-1,2], k = 3
 * prefix = [0, 2, 1, 3]   (prefix[0]=0, prefix[1]=2, prefix[2]=1, prefix[3]=3)
 *
 * i=0: deque=[] → push 0           → deque=[0]
 * i=1 (prefix=2): front check: 2-0=2 < 3, no match.
 *      back check: prefix[0]=0 >= 2? no → push 1   → deque=[0,1]
 * i=2 (prefix=1): front check: 1-0=1 < 3, no match.
 *      back check: prefix[1]=2 >= 1? yes → pop 1   → deque=[0]
 *                  prefix[0]=0 >= 1? no → push 2   → deque=[0,2]
 * i=3 (prefix=3): front check: 3-0=3 >= 3 → result=min(∞,3-0)=3, pop 0 → deque=[2]
 *                 front check again: 3-1=2 < 3, stop.
 *      back check: prefix[2]=1 >= 3? no → push 3   → deque=[2,3]
 *
 * result = 3 ✓
 *
 * Time:  O(N) — each index pushed and popped at most once
 * Space: O(N) — prefix array + deque
 */
const shortestSubarray = (nums, k) => {
  const n = nums.length;

  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  const deque = []; // indices into prefix[], strictly increasing prefix values
  let result = Infinity;

  for (let i = 0; i <= n; i++) {
    // Front: did we just complete a valid subarray ending at i?
    while (deque.length && prefix[i] - prefix[deque[0]] >= k) {
      result = Math.min(result, i - deque.shift());
    }

    // Back: drop any index whose prefix sum is >= prefix[i] — dominated by i
    while (deque.length && prefix[deque[deque.length - 1]] >= prefix[i]) {
      deque.pop();
    }

    deque.push(i);
  }

  return result === Infinity ? -1 : result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Shortest Subarray with Sum at Least K Tests ===\n");

console.log("Test 1:", shortestSubarray([1], 1));        // Expected: 1
console.log("Test 2:", shortestSubarray([1, 2], 4));      // Expected: -1
console.log("Test 3:", shortestSubarray([2, -1, 2], 3));  // Expected: 3
console.log("Test 4:", shortestSubarray([84, -37, 32, 40, 95], 167)); // Expected: 3
console.log("Test 5:", shortestSubarray([-28, 81, -20, 28, -29], 89)); // Expected: 3

module.exports = { shortestSubarray };
