// ============================================================================
// APPROACH: Linear Scan (Three Stages)
// ============================================================================
/**
 * INTUITION:
 * Since the input is already sorted, we can process the intervals in one pass:
 * 1. Left Part: Add all intervals that end strictly before the new interval starts.
 * 2. Overlap Part: Merge all intervals that overlap with the new interval.
 *    - Start = min(currentStart, newStart)
 *    - End = max(currentEnd, newEnd)
 * 3. Right Part: Add all remaining intervals that start after the new interval ends.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N) for the result array.
 */
const insert = (intervals, newInterval) => {
  const result = [];
  let i = 0;
  const n = intervals.length;
  let [newStart, newEnd] = newInterval;

  // Phase 1: As long as the current interval ends before the new interval starts, it can never overlap.
  while (i < n && intervals[i][1] < newStart) {
    result.push(intervals[i]);
    i++;
  }

  // Phase 2: As long as the current interval touches or overlaps the new interval, merge it.
  while (i < n && intervals[i][0] <= newEnd) {
    newStart = Math.min(newStart, intervals[i][0]);
    newEnd = Math.max(newEnd, intervals[i][1]);
    i++;
  }
  result.push([newStart, newEnd]);

  // Phase 3: Add the remaining intervals
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Insert Interval Tests ===\n");
console.log(
  "Test 1:",
  insert(
    [
      [1, 3],
      [6, 9],
    ],
    [2, 5]
  )
); // Expected: [[1,5],[6,9]]
console.log(
  "Test 2:",
  insert(
    [
      [1, 2],
      [3, 5],
      [6, 7],
      [8, 10],
      [12, 16],
    ],
    [4, 8]
  )
); // Expected: [[1,2],[3,10],[12,16]]

module.exports = { insert };
