/**
 * ============================================================================
 * PROBLEM: Kth Largest Element in a Stream (LeetCode #703)
 * ============================================================================
 * Design a class to find the kth largest element in a stream.
 * - KthLargest(k, nums): init with k and initial array nums.
 * - add(val): add val to the stream and return the current kth largest.
 *
 * Example:
 * KthLargest(3, [4,5,8,2])
 * add(3)  → 4   (stream=[2,3,4,5,8], 3rd largest=4)
 * add(5)  → 5   (stream=[2,3,4,5,5,8])
 * add(10) → 5
 * add(9)  → 8
 * add(4)  → 8
 *
 * Constraints:
 * - 1 <= k <= 10^4
 * - 0 <= nums.length <= 10^4
 * - -10^4 <= nums[i] <= 10^4
 * - add will be called at most 10^4 times
 */

// ============================================================================
// APPROACH: Min-Heap of size K
// ============================================================================
/**
 * STORY / INTUITION:
 * Maintain a Min-Heap that holds exactly the K largest elements seen so far.
 * The SMALLEST of these K elements (heap top) IS the Kth largest overall.
 *
 * On each add:
 * - Push new value into heap.
 * - If heap size > K, pop (removes the smallest, which is too small to matter).
 * - Return heap top (= Kth largest).
 *
 * WHY MIN-HEAP? We want to quickly evict elements that are too small to be in
 * the top-K. The smallest of the top-K is always at the top of a min-heap.
 *
 * DRY RUN: k=3, nums=[4,5,8,2] → heap after init = [4,5,8]
 * add(3): push 3 → [3,4,5,8] size=4>3 → pop min(3) → [4,5,8]. top=4 ✓
 * add(5): push 5 → [4,5,5,8] size=4>3 → pop 4 → [5,5,8]. top=5 ✓
 * add(10): push 10 → [5,5,8,10] → pop 5 → [5,8,10]. top=5 ✓
 *
 * Time:  O(log K) per add
 * Space: O(K)
 */
class MinHeap {
  constructor() { this.h = []; }
  size() { return this.h.length; }
  top() { return this.h[0]; }
  push(x) {
    this.h.push(x);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop() {
    if (this.h.length === 1) return this.h.pop();
    const top = this.h[0];
    this.h[0] = this.h.pop();
    let i = 0;
    while (true) {
      let s = i, l = 2*i+1, r = 2*i+2;
      if (l < this.h.length && this.h[l] < this.h[s]) s = l;
      if (r < this.h.length && this.h[r] < this.h[s]) s = r;
      if (s === i) break;
      [this.h[i], this.h[s]] = [this.h[s], this.h[i]];
      i = s;
    }
    return top;
  }
}

class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.heap = new MinHeap();
    for (const num of nums) this.add(num);
  }

  add(val) {
    this.heap.push(val);
    if (this.heap.size() > this.k) this.heap.pop();
    return this.heap.top();
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Kth Largest in Stream Tests ===\n");

const kth = new KthLargest(3, [4, 5, 8, 2]);
console.log("add(3):", kth.add(3));   // Expected: 4
console.log("add(5):", kth.add(5));   // Expected: 5
console.log("add(10):", kth.add(10)); // Expected: 5
console.log("add(9):", kth.add(9));   // Expected: 8
console.log("add(4):", kth.add(4));   // Expected: 8

module.exports = { KthLargest };
