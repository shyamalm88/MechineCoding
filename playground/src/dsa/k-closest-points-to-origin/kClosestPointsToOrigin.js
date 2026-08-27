// ============================================================================
// APPROACH: Max-Heap of size K
// ============================================================================
/**
 * STORY / INTUITION:
 * Keep a "VIP club" of K closest points. For each new point:
 * - Add it to the club.
 * - If club size > K, evict the FARTHEST member (max-heap top).
 * After all points, the K members left are the K closest.
 *
 * Use a MAX-HEAP keyed by distance² (skip sqrt — same ordering).
 * Negate distance to use MinHeap as MaxHeap (or implement MaxHeap).
 *
 * ALTERNATIVE: QuickSelect — O(N) average, but O(N²) worst case.
 * Heap approach is O(N log K) and simpler to explain in interview.
 *
 * DRY RUN: points=[[1,3],[-2,2],[5,0]], k=2
 * dist²: [10, 8, 25]
 * push [1,3]  → heap(max): {10}    size=1
 * push [-2,2] → heap: {10,8}  size=2
 * push [5,0]  → heap: {10,8,25} size=3 > 2 → pop max(25) → {10,8}
 * Result: [[1,3],[-2,2]] ✓
 *
 * Time:  O(N log K)
 * Space: O(K)
 */

// MaxHeap keyed by dist² (stores [dist², point])
class MaxHeap {
  constructor() { this.h = []; }
  size() { return this.h.length; }
  top() { return this.h[0]; }
  push([d, p]) {
    this.h.push([d, p]);
    let i = this.h.length - 1;
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (this.h[par][0] >= this.h[i][0]) break;
      [this.h[par], this.h[i]] = [this.h[i], this.h[par]];
      i = par;
    }
  }
  pop() {
    if (this.h.length === 1) return this.h.pop();
    const top = this.h[0];
    this.h[0] = this.h.pop();
    let i = 0;
    while (true) {
      let s = i, l = 2*i+1, r = 2*i+2;
      if (l < this.h.length && this.h[l][0] > this.h[s][0]) s = l;
      if (r < this.h.length && this.h[r][0] > this.h[s][0]) s = r;
      if (s === i) break;
      [this.h[i], this.h[s]] = [this.h[s], this.h[i]];
      i = s;
    }
    return top;
  }
}

const kClosest = (points, k) => {
  const heap = new MaxHeap();

  for (const [x, y] of points) {
    const dist2 = x * x + y * y;
    heap.push([dist2, [x, y]]);
    if (heap.size() > k) heap.pop(); // evict farthest
  }

  return heap.h.map(([, p]) => p);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== K Closest Points to Origin Tests ===\n");

console.log("Test 1:", kClosest([[1, 3], [-2, 2]], 1));          // Expected: [[-2,2]]
console.log("Test 2:", kClosest([[3, 3], [5, -1], [-2, 4]], 2)); // Expected: [[3,3],[-2,4]]

module.exports = { kClosest };
