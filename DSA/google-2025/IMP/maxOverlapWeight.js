/**
 * ============================================================================
 * PROBLEM: Maximum Weight Overlap
 * ============================================================================
 * Given a set of intervals, each with a weight. Find the maximum total weight
 * at any single point in time.
 *
 * Example:
 * [1, 5, 10], [2, 6, 20]
 * Time 1-2: weight 10
 * Time 2-5: weight 10 + 20 = 30 (Max)
 * Time 5-6: weight 20
 */

// ============================================================================
// APPROACH: Sweep Line Algorithm
// ============================================================================
/**
 * INTUITION:
 * We can decompose each interval [start, end, weight] into two events:
 * 1. At `start`: Add `weight` to current total.
 * 2. At `end`: Subtract `weight` from current total.
 *
 * Sort all events by time. Iterate through them and track the running sum.
 * The maximum value of the running sum is the answer.
 *
 * Time Complexity: O(N log N) due to sorting.
 * Space Complexity: O(N) for events.
 */
function maxOverlapWeight(intervals) {
  const events = [];

  for (const { start, end, weight } of intervals) {
    events.push([start, +weight]);
    events.push([end, -weight]);
  }

  events.sort((a, b) => a[0] - b[0]);

  let curr = 0;
  let max = 0;

  for (const [, delta] of events) {
    curr += delta;
    max = Math.max(max, curr);
  }

  return max;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Max Overlap Weight Tests ===\n");

const intervals = [
  { start: 1, end: 5, weight: 10 },
  { start: 2, end: 6, weight: 20 },
  { start: 4, end: 8, weight: 5 },
];

console.log("Max Weight:", maxOverlapWeight(intervals));
// Events: (1, +10), (2, +20), (4, +5), (5, -10), (6, -20), (8, -5)
// Sums: 10 -> 30 -> 35 -> 25 -> 5 -> 0. Max is 35.

module.exports = { maxOverlapWeight };
