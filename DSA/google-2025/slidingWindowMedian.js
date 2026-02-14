/**
 * ============================================================================
 * PROBLEM: Sliding Window Median (LeetCode #480)
 * ============================================================================
 * Median is the middle value in an ordered integer list. If the size of the
 * list is even, there is no middle value. So the median is the mean of the
 * two middle value.
 *
 * Given an array nums, there is a sliding window of size k which is moving
 * from the very left of the array to the very right. You can only see the
 * k numbers in the window. Each time the sliding window moves right by one
 * position.
 *
 * Return the median array for each window in the original array.
 */

// ============================================================================
// APPROACH: Two Heaps with Lazy Removal
// ============================================================================
/**
 * INTUITION:
 * To find the median efficiently, we can maintain two heaps:
 * 1. MaxHeap (`small`): Stores the smaller half of the numbers.
 * 2. MinHeap (`large`): Stores the larger half of the numbers.
 *
 * The median is either the top of `small` (if odd length) or average of tops
 * (if even length).
 *
 * Challenge: Removing elements leaving the window.
 * Standard heaps don't support efficient removal of arbitrary elements (O(N)).
 * Solution: "Lazy Removal".
 * - When an element needs to be removed, we record it in a hash map (`delayed`).
 * - If that element appears at the top of a heap later, we pop it then.
 * - We maintain balance between heaps (size difference <= 1) accounting for
 *   valid (non-deleted) elements.
 *
 * DRY RUN:
 * Window Size K=3. Stream: [1, 3, -1, -3, 5]
 *
 * 1. Add 1: Small: [1], Large: []. Balance ok.
 * 2. Add 3: Small: [1], Large: [3]. Balance ok.
 * 3. Add -1: Small: [-1, 1], Large: [3]. Rebalance -> Small: [-1], Large: [1, 3].
 *    Wait, logic: if val <= small.top, push small.
 *    -1 <= 1. Push -1 to Small. Small: [1, -1].
 *    Rebalance: Small has 2, Large has 1. OK.
 *    Median: Small top (1).
 *
 * 4. Slide: Remove 1, Add -3.
 *    - Mark 1 for deletion.
 *    - Add -3. -3 <= 1. Push to Small. Small: [1, -1, -3].
 *    - Prune Small: Top is 1 (deleted). Pop. Small: [-1, -3].
 *    - Rebalance.
 *    - Median: -1.
 */
class SlidingWindowMedian {
  constructor(windowSize) {
    this.windowSize = windowSize;
    this.small = []; // maxHeap (invert values)
    this.large = []; // minHeap
    this.delayed = new Map();
    this.events = []; // [timestamp, value]
  }

  // ---------- Heap helpers ----------
  pushMax(heap, val) {
    heap.push(val);
    heap.sort((a, b) => b - a);
  }

  pushMin(heap, val) {
    heap.push(val);
    heap.sort((a, b) => a - b);
  }

  popMax(heap) {
    return heap.shift();
  }

  popMin(heap) {
    return heap.shift();
  }

  // ---------- Lazy cleanup ----------
  prune(heap, isMax) {
    while (heap.length) {
      const val = heap[0];
      const key = val;
      if (this.delayed.get(key)) {
        this.delayed.set(key, this.delayed.get(key) - 1);
        if (this.delayed.get(key) === 0) {
          this.delayed.delete(key);
        }
        heap.shift();
      } else break;
    }
  }

  rebalance() {
    if (this.small.length > this.large.length + 1) {
      this.pushMin(this.large, this.popMax(this.small));
    } else if (this.small.length < this.large.length) {
      this.pushMax(this.small, this.popMin(this.large));
    }
  }

  // ---------- Public API ----------
  add(timestamp, value) {
    this.events.push([timestamp, value]);

    if (!this.small.length || value <= this.small[0]) {
      this.pushMax(this.small, value);
    } else {
      this.pushMin(this.large, value);
    }

    this.rebalance();
  }

  expire(currentTime) {
    while (
      this.events.length &&
      currentTime - this.events[0][0] > this.windowSize
    ) {
      const [, val] = this.events.shift();
      this.delayed.set(val, (this.delayed.get(val) || 0) + 1);

      if (val <= this.small[0]) {
        this.prune(this.small, true);
      } else {
        this.prune(this.large, false);
      }

      this.rebalance();
    }
  }

  getMedian() {
    this.prune(this.small, true);
    this.prune(this.large, false);

    if (this.small.length > this.large.length) {
      return this.small[0];
    }
    return (this.small[0] + this.large[0]) / 2;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Sliding Window Median Tests ===\n");

const swm = new SlidingWindowMedian(3);
const nums = [1, 3, -1, -3, 5, 3, 6, 7];
const result = [];

for (let i = 0; i < nums.length; i++) {
  swm.add(i, nums[i]);
  if (i >= 2) {
    swm.expire(i);
    result.push(swm.getMedian());
  }
}
console.log("Medians:", result);
// Expected: [1, -1, -1, 3, 5, 6]
// Windows: [1,3,-1]->1, [3,-1,-3]->-1, [-1,-3,5]->-1, [-3,5,3]->3, [5,3,6]->5, [3,6,7]->6
