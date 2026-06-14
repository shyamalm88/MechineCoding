/**
 * ============================================================================
 * PROBLEM: Merge Intervals with Priority (Sweep-Line Splitting)
 * ============================================================================
 * Given a list of intervals, where each interval has {start, end, priority}.
 * If two intervals overlap, the one with the HIGHER priority wins in the
 * overlapping region — intervals get SPLIT at the boundaries where the
 * "winner" changes.
 *
 * Return the final set of non-overlapping intervals representing the
 * "winning" timeline, with adjacent segments that share the same winning
 * priority merged back together.
 *
 * Example:
 * Input: [{start:1,end:5,priority:1}, {start:2,end:6,priority:2}, {start:8,end:10,priority:1}]
 * Output: [{start:1,end:2,priority:1}, {start:2,end:6,priority:2}, {start:8,end:10,priority:1}]
 * Explanation: priority-2 interval [2,6] outranks priority-1 interval [1,5]
 * in their overlap [2,5], so [1,5] gets cut down to just [1,2].
 */

// ============================================================================
// APPROACH: Coordinate-Compressed Sweep Line
// ============================================================================
/**
 * STORY / INTUITION:
 * A purely greedy "winner takes all" merge (keep one whole interval, discard
 * the other) loses information — the loser might still own a region the
 * winner doesn't cover. Instead:
 *
 * 1) Collect every interval's start and end points as "cut points" on the
 *    timeline, sort and dedupe them. These cut points slice the timeline
 *    into elementary segments where coverage cannot change mid-segment.
 *
 * 2) For each elementary segment [x, y), find every interval that fully
 *    covers it and pick the one with the highest priority — that's the
 *    winner for this segment.
 *
 * 3) Walk the labeled segments and merge consecutive ones that share the
 *    same winning priority and are touching (no gap) back into a single
 *    output interval.
 *
 * DRY RUN: [{1,5,p1}, {2,6,p2}, {8,10,p1}]  (p2 > p1)
 *  Cut points: 1, 2, 5, 6, 8, 10
 *  [1,2): only [1,5,p1] covers      -> winner p1
 *  [2,5): [1,5,p1] AND [2,6,p2]     -> winner p2 (higher priority)
 *  [5,6): only [2,6,p2] covers      -> winner p2
 *  [6,8): nothing covers            -> gap, dropped
 *  [8,10): only [8,10,p1] covers    -> winner p1
 *  Merge adjacent same-priority touching segments:
 *    [1,2,p1] | [2,5,p2]+[5,6,p2] -> [2,6,p2] | [8,10,p1]
 *  Result: [{1,2,p1}, {2,6,p2}, {8,10,p1}]
 *
 * Time:  O(N^2) — O(N) elementary segments, each scanning all N intervals
 *        to find the covering winner.
 * Space: O(N) for cut points and output segments.
 */
function resolveByPriority(intervals) {
  // Step 1: gather and sort all cut points
  const points = new Set();
  for (const { start, end } of intervals) {
    points.add(start);
    points.add(end);
  }
  const cuts = [...points].sort((a, b) => a - b);

  // Step 2: label each elementary segment with its highest-priority winner
  const segments = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const segStart = cuts[i];
    const segEnd = cuts[i + 1];
    if (segStart === segEnd) continue;

    let winner = null;
    for (const interval of intervals) {
      if (interval.start <= segStart && interval.end >= segEnd) {
        if (!winner || interval.priority > winner.priority) {
          winner = interval;
        }
      }
    }

    if (winner) {
      segments.push({ start: segStart, end: segEnd, priority: winner.priority });
    }
  }

  // Step 3: merge adjacent, touching segments that share the same winner
  const result = [];
  for (const seg of segments) {
    const prev = result[result.length - 1];
    if (prev && prev.end === seg.start && prev.priority === seg.priority) {
      prev.end = seg.end;
    } else {
      result.push({ ...seg });
    }
  }

  return result;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Resolve By Priority (Sweep-Line Splitting) Tests ===\n");

console.log(
  "Test 1 (higher priority cuts a hole into the lower one):",
  resolveByPriority([
    { start: 1, end: 5, priority: 1 },
    { start: 2, end: 6, priority: 2 },
    { start: 8, end: 10, priority: 1 },
  ]),
);
// Expected: [{start:1,end:2,priority:1}, {start:2,end:6,priority:2}, {start:8,end:10,priority:1}]

console.log(
  "Test 2 (no overlap, gap preserved):",
  resolveByPriority([
    { start: 0, end: 3, priority: 1 },
    { start: 5, end: 8, priority: 2 },
  ]),
);
// Expected: [{start:0,end:3,priority:1}, {start:5,end:8,priority:2}]

console.log(
  "Test 3 (a small high-priority interval punches through a big low-priority one):",
  resolveByPriority([
    { start: 0, end: 10, priority: 1 },
    { start: 2, end: 4, priority: 3 },
    { start: 6, end: 8, priority: 2 },
  ]),
);
// Expected: [{start:0,end:2,priority:1}, {start:2,end:4,priority:3},
//            {start:4,end:6,priority:1}, {start:6,end:8,priority:2},
//            {start:8,end:10,priority:1}]

module.exports = { resolveByPriority };
