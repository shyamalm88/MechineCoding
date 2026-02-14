/**
 * ============================================================================
 * PROBLEM: Merge Intervals with Priority
 * ============================================================================
 * Given a list of intervals, where each interval has a {start, end, priority}.
 * If two intervals overlap, the one with the higher priority wins in the
 * overlapping region.
 *
 * Return the final set of non-overlapping intervals representing the
 * "winning" timeline.
 *
 * NOTE: The implementation below is a simplified greedy approach that assumes
 * we just want to pick *whole* intervals based on priority when they conflict,
 * rather than splitting them.
 *
 * If the problem requires splitting intervals (e.g., [0, 10, p1] and [5, 15, p2]
 * with p2 > p1 results in [0, 5, p1], [5, 15, p2]), a Sweep Line approach
 * would be needed. The code below implements a "Winner Takes All" greedy merge.
 */

// ============================================================================
// APPROACH: Greedy Sort + Merge
// ============================================================================
/**
 * INTUITION:
 * 1. Sort intervals by start time.
 * 2. Iterate through intervals. Maintain an `active` interval.
 * 3. If current interval overlaps with `active`:
 *    - If current has higher priority, it replaces `active` (active is cut short
 *      or discarded - simplified here to discarded/replaced).
 *    - Else, current is ignored (shadowed by active).
 */
function resolveByPriority(intervals) {
  intervals.sort((a, b) => a.start - b.start);

  const result = [];
  let active = null;

  for (const curr of intervals) {
    if (!active || curr.start >= active.end) {
      result.push(curr);
      active = curr;
    } else {
      // Overlap → keep higher priority
      if (curr.priority > active.priority) {
        result.pop();
        result.push(curr);
        active = curr;
      }
    }
  }

  return result;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Resolve By Priority Tests ===\n");

const intervals = [
  { start: 1, end: 5, priority: 1 },
  { start: 2, end: 6, priority: 2 }, // Higher priority, overlaps
  { start: 8, end: 10, priority: 1 },
];

console.log("Resolved:", resolveByPriority(intervals));
// Logic trace:
// 1. Active: [1, 5, p1]
// 2. Curr: [2, 6, p2]. Overlaps. p2 > p1. Pop [1,5]. Push [2,6]. Active: [2,6].
// 3. Curr: [8, 10, p1]. No overlap. Push.
// Result: [{2,6,p2}, {8,10,p1}]
