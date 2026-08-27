// ============================================================================
// APPROACH: Sweep Line over Critical X-Coordinates + Max-Heap (Lazy Eviction)
// ============================================================================
/**
 * STORY / INTUITION:
 * The skyline only changes HEIGHT at a building's LEFT or RIGHT edge — those
 * are the only "events" that matter. Collect all such x-coordinates, sort
 * them, and sweep left to right. At each x, the current skyline height is the
 * MAX height among all buildings that are "active" (started but not yet
 * ended) at that x.
 *
 * Encode events as [x, height, isStart]:
 *   - START event:  height is POSITIVE  (building begins)
 *   - END event:    height is NEGATIVE  (building ends)
 * Sort events by x; if x ties, process STARTS before ENDS at the SAME x is
 * WRONG for max — actually we need: at a tie, process in an order such that
 * a building ending at x and one starting at x are both reflected correctly.
 * The simplest robust trick: sort by x, and for ties sort START events
 * (positive height) before END events (negative height) — but break further
 * ties among starts by LARGER height first, and among ends by SMALLER height
 * first. This guarantees the heap always reflects the correct max exactly
 * when we query it.
 *
 * Use a MAX-HEAP of active heights with LAZY EVICTION: instead of removing an
 * ended building's height immediately (heaps don't support efficient
 * arbitrary delete), keep a `count` map of how many times each height is
 * currently active. On an END event, decrement the count. Before reading the
 * heap's max, pop off any heights whose count has dropped to 0.
 *
 * At each distinct x, after processing all events at that x, compare the new
 * max height (0 if heap is empty) to the previous max. If it changed, emit
 * `[x, newMax]`.
 *
 * DRY RUN: buildings=[[0,2,3],[2,5,3]]
 * events: [0,3,start], [2,-3,end], [2,3,start], [5,-3,end]
 * sorted (x, then starts-by-desc-height before ends-by-asc-height):
 *   [0,3,start], [2,3,start], [2,-3,end], [5,-3,end]
 * x=0: push 3 -> active={3:1}, max=3, prevMax=0 -> emit [0,3]
 * x=2: push 3 -> active={3:2}; then end -3 -> active={3:1}, max=3,
 *       prevMax=3 -> no change, no emit
 * x=5: end -3 -> active={3:0}, lazy-evict -> heap empty, max=0,
 *       prevMax=3 -> emit [5,0]
 * Result: [[0,3],[5,0]] ✓
 *
 * Time:  O(N log N) — sorting 2N events + heap ops
 * Space: O(N) — events array, heap, and count map
 */
class MaxHeap {
  constructor() {
    this.heap = [];
  }
  size() {
    return this.heap.length;
  }
  peek() {
    return this.heap[0];
  }
  push(x) {
    this.heap.push(x);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[i] <= this.heap[p]) break;
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      i = p;
    }
  }
  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        let largest = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < this.heap.length && this.heap[l] > this.heap[largest]) largest = l;
        if (r < this.heap.length && this.heap[r] > this.heap[largest]) largest = r;
        if (largest === i) break;
        [this.heap[i], this.heap[largest]] = [this.heap[largest], this.heap[i]];
        i = largest;
      }
    }
    return top;
  }
}

const getSkyline = (buildings) => {
  const events = [];
  for (const [left, right, height] of buildings) {
    events.push([left, height, "start"]);
    events.push([right, height, "end"]);
  }

  // Sort by x; at same x, starts (higher height first) before ends (lower height first)
  events.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    if (a[2] !== b[2]) return a[2] === "start" ? -1 : 1;
    if (a[2] === "start") return b[1] - a[1]; // starts: tallest first
    return a[1] - b[1]; // ends: shortest first
  });

  const result = [];
  const heap = new MaxHeap();
  const activeCount = new Map();
  let prevMax = 0;

  let i = 0;
  while (i < events.length) {
    const x = events[i][0];

    // Process all events at this x
    while (i < events.length && events[i][0] === x) {
      const [, height, type] = events[i];
      if (type === "start") {
        heap.push(height);
        activeCount.set(height, (activeCount.get(height) || 0) + 1);
      } else {
        activeCount.set(height, activeCount.get(height) - 1);
      }
      i++;
    }

    // Lazy-evict heights whose count has dropped to 0
    while (heap.size() > 0 && activeCount.get(heap.peek()) === 0) {
      heap.pop();
    }

    const currentMax = heap.size() === 0 ? 0 : heap.peek();
    if (currentMax !== prevMax) {
      result.push([x, currentMax]);
      prevMax = currentMax;
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== The Skyline Problem Tests ===\n");

console.log(
  "Test 1:",
  JSON.stringify(getSkyline([[2, 9, 10], [3, 7, 15], [5, 12, 12], [15, 20, 10], [19, 24, 8]]))
); // Expected: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]

console.log("Test 2:", JSON.stringify(getSkyline([[0, 2, 3], [2, 5, 3]]))); // Expected: [[0,3],[5,0]]

module.exports = { getSkyline };
