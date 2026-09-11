// ============================================================================
// APPROACH: Flatten, Sort by Start, Then Read the Gaps
// ============================================================================
/**
 * STORY / INTUITION:
 * The per-employee grouping is a decoy. "Free for EVERYONE" means no employee
 * is working, and an interval blocks that moment regardless of whose it is. So
 * throw the employee boundaries away, pour every interval into one list, and
 * sort by start time.
 *
 * Now walk left to right tracking the furthest point anyone is busy until --
 * call it `busyUntil`. For each interval:
 *
 *   - starts AFTER busyUntil  -> nobody was working in between. That is a gap.
 *   - starts at or before it  -> overlaps the block we are in; just extend
 *                               busyUntil if this one runs later.
 *
 * That is Merge Intervals with the output inverted: instead of emitting the
 * merged blocks, emit the space BETWEEN them.
 *
 * THE TRAP -- take the MAX, do not just assign:
 *   busyUntil = Math.max(busyUntil, end)
 * A fully nested interval like [1,10] followed by [2,3] would otherwise pull
 * busyUntil backwards from 10 to 3 and invent a free slot from 3 to the next
 * start, when everyone is in fact busy until 10. Sorting by START does not
 * order the ENDS, so nesting is normal, not an edge case.
 *
 * WHY POSITIVE LENGTH MATTERS: two meetings touching exactly ([1,3] then
 * [3,5]) leave a gap of zero minutes. Testing `start > busyUntil` rather than
 * `>=` keeps those out.
 *
 * DRY RUN: [[[1,3],[6,7]], [[2,4]], [[2,5],[9,12]]]
 * flattened + sorted by start:
 *   [1,3] [2,4] [2,5] [6,7] [9,12]
 * busyUntil = 3          after [1,3]
 * [2,4]: 2 > 3? no  -> busyUntil = max(3,4) = 4
 * [2,5]: 2 > 4? no  -> busyUntil = max(4,5) = 5
 * [6,7]: 6 > 5? YES -> free [5,6];  busyUntil = 7
 * [9,12]: 9 > 7? YES -> free [7,9]; busyUntil = 12
 * answer [[5,6],[7,9]]
 *
 * Time:  O(N log N) for N intervals total -- the sort dominates
 * Space: O(N) for the flattened list
 *
 * FOLLOW-UP worth knowing: with K employees each already sorted, a min-heap
 * seeded with one interval per employee merges them in O(N log K) instead of
 * re-sorting everything. Better when K is far smaller than N; the flatten-and-
 * sort version is what to write first.
 */
const employeeFreeTime = (schedule) => {
  // Whose interval it is never matters -- only that SOMEONE is busy.
  const intervals = [];
  for (const employee of schedule) {
    for (const interval of employee) intervals.push(interval);
  }

  if (intervals.length === 0) return [];

  intervals.sort((a, b) => a[0] - b[0]);

  const free = [];
  let busyUntil = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];

    if (start > busyUntil) {
      // Strictly greater: touching meetings leave a zero-length gap, which is
      // not free time.
      free.push([busyUntil, start]);
      busyUntil = end;
    } else {
      // Overlapping or nested. MAX, not assignment -- a nested [2,3] inside
      // [1,10] must not drag the busy frontier back to 3.
      busyUntil = Math.max(busyUntil, end);
    }
  }

  return free;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Employee Free Time Tests ===\n");

console.log("Test 1:", JSON.stringify(employeeFreeTime([[[1, 2], [5, 6]], [[1, 3]], [[4, 10]]])));
// Expected: [[3,4]]

console.log("Test 2:", JSON.stringify(employeeFreeTime([[[1, 3], [6, 7]], [[2, 4]], [[2, 5], [9, 12]]])));
// Expected: [[5,6],[7,9]]

console.log("Test 3:", JSON.stringify(employeeFreeTime([[[1, 10]], [[2, 3]]])));
// Expected: [] (nested interval must not create a fake gap)

console.log("Test 4:", JSON.stringify(employeeFreeTime([[[1, 3]], [[3, 5]]])));
// Expected: [] (touching, so the gap has zero length)

console.log("Test 5:", JSON.stringify(employeeFreeTime([[[1, 2]]])));
// Expected: [] (before the first and after the last are infinite, not reported)

console.log("Test 6:", JSON.stringify(employeeFreeTime([[[1, 2], [10, 11]], [[4, 5]]])));
// Expected: [[2,4],[5,10]]

console.log("Test 7:", JSON.stringify(employeeFreeTime([[]])));
// Expected: [] (employee with no meetings)

module.exports = { employeeFreeTime };
