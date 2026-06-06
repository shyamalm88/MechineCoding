/**
 * ============================================================================
 * PROBLEM: Find Median from Data Stream (LeetCode #295)
 * ============================================================================
 * Design a data structure that supports:
 * - addNum(num): add a number to the stream
 * - findMedian(): return the median of all numbers so far
 *
 * Example:
 * addNum(1) → addNum(2) → findMedian() = 1.5
 * addNum(3) → findMedian() = 2.0
 *
 * Constraints:
 * - -10^5 <= num <= 10^5
 * - At most 5 * 10^4 calls to addNum and findMedian
 * - findMedian will only be called after at least one addNum
 */

// ============================================================================
// APPROACH: Two Heaps — MaxHeap (lower half) + MinHeap (upper half)
// ============================================================================
/**
 * STORY / INTUITION:
 * Split all numbers into two halves:
 *   - lo: MaxHeap holding the LOWER half  (top = largest of lower half)
 *   - hi: MinHeap holding the UPPER half  (top = smallest of upper half)
 *
 * Invariants after every addNum:
 *   1. lo.size == hi.size  OR  lo.size == hi.size + 1  (lo has equal or one extra)
 *   2. lo.top() <= hi.top()  (lower half is truly lower)
 *
 * findMedian:
 *   - Odd total → median = lo.top()
 *   - Even total → median = (lo.top() + hi.top()) / 2
 *
 * ADDING A NUMBER (always balance after add):
 *   1. Push to lo (max-heap).
 *   2. Move lo's max to hi (ensures lo.top <= hi.top).
 *   3. If hi.size > lo.size, move hi's min back to lo (rebalance).
 *
 * DRY RUN: add(1), add(2), add(3)
 * add(1): lo=[1], hi=[]      → lo.size=1, hi.size=0  → median=1
 * add(2): push 2→lo=[1,2], move lo.max(2)→hi=[2], hi.size=lo.size → move hi.min(2)→lo=[1,2] → median=(1+2)/2=1.5?
 *         Wait: lo=[2,1] max-heap. After step2: lo=[1], hi=[2]. Balanced.
 *         median=(1+2)/2=1.5 ✓
 * add(3): push 3→lo=[3,1]. Move lo.max(3)→hi=[2,3]. hi.size > lo.size → move hi.min(2)→lo=[2,1].
 *         lo=[2,1], hi=[3]. median=lo.top()=2 ✓
 *
 * Time:  O(log N) addNum, O(1) findMedian
 * Space: O(N)
 */

// MinHeap implementation
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

// MaxHeap: negate values to reuse MinHeap
class MaxHeap {
  constructor() { this.h = new MinHeap(); }
  size() { return this.h.size(); }
  top() { return -this.h.top(); }
  push(x) { this.h.push(-x); }
  pop() { return -this.h.pop(); }
}

class MedianFinder {
  constructor() {
    this.lo = new MaxHeap(); // lower half
    this.hi = new MinHeap(); // upper half
  }

  addNum(num) {
    this.lo.push(num);                  // 1. push to lower
    this.hi.push(this.lo.pop());        // 2. move lo's max → hi (fixes ordering)
    if (this.hi.size() > this.lo.size()) {
      this.lo.push(this.hi.pop());      // 3. rebalance: hi should never be larger
    }
  }

  findMedian() {
    if (this.lo.size() > this.hi.size()) return this.lo.top();
    return (this.lo.top() + this.hi.top()) / 2;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Find Median from Data Stream Tests ===\n");

const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log("Median after [1,2]:", mf.findMedian()); // Expected: 1.5
mf.addNum(3);
console.log("Median after [1,2,3]:", mf.findMedian()); // Expected: 2.0
mf.addNum(4);
console.log("Median after [1,2,3,4]:", mf.findMedian()); // Expected: 2.5

module.exports = { MedianFinder };
