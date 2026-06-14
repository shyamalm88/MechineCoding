/**
 * ============================================================================
 * PROBLEM: Moving Average from Data Stream (LeetCode #346)
 * ============================================================================
 * Given a stream of integers and a window size, calculate the moving average
 * of all integers in the sliding window.
 *
 * Example:
 * const ma = new MovingAverage(3);
 * ma.next(1);  // 1.0       (window: [1])
 * ma.next(10); // 5.5       (window: [1,10])
 * ma.next(3);  // 4.66667   (window: [1,10,3])
 * ma.next(5);  // 6.0       (window: [10,3,5]) ← 1 evicted
 *
 * Constraints:
 * - 1 <= size <= 1000
 * - -10^5 <= val <= 10^5
 * - At most 10^4 calls to next
 */

// ============================================================================
// APPROACH: Fixed-Size Queue + Running Sum
// ============================================================================
/**
 * STORY / INTUITION:
 * Imagine a conveyor belt with exactly `size` slots. New items join at the back.
 * When full, the oldest item falls off the front to make room.
 * Track a running sum: add new value, subtract the evicted value.
 * Average = runningSum / currentWindowSize.
 *
 * KEY INSIGHT: We never recompute the whole sum — just adjust it at the edges.
 * This makes next() always O(1) instead of O(size).
 *
 * DRY RUN (size=3):
 * next(1):  queue=[1], sum=1       → 1/1 = 1.0
 * next(10): queue=[1,10], sum=11   → 11/2 = 5.5
 * next(3):  queue=[1,10,3], sum=14 → 14/3 ≈ 4.667
 * next(5):  queue full! evict 1 → queue=[10,3,5], sum=14-1+5=18 → 18/3 = 6.0
 *
 * Time:  O(1) per next()
 * Space: O(size)
 */
class MovingAverage {
  constructor(size) {
    this.size = size;
    this.queue = [];
    this.sum = 0;
  }

  next(val) {
    this.queue.push(val);
    this.sum += val;

    // Evict the oldest element if window exceeds size
    if (this.queue.length > this.size) {
      this.sum -= this.queue.shift();
    }

    return this.sum / this.queue.length;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Moving Average from Data Stream Tests ===\n");

const ma = new MovingAverage(3);
console.log("next(1):", ma.next(1).toFixed(5));   // Expected: 1.00000
console.log("next(10):", ma.next(10).toFixed(5)); // Expected: 5.50000
console.log("next(3):", ma.next(3).toFixed(5));   // Expected: 4.66667
console.log("next(5):", ma.next(5).toFixed(5));   // Expected: 6.00000

module.exports = { MovingAverage };
