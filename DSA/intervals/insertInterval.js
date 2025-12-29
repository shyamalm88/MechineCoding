/**
 * ============================================================================
 * PROBLEM: Insert Interval (LeetCode #57)
 * ============================================================================
 * You are given an array of non-overlapping intervals intervals where
 * intervals[i] = [starti, endi] represent the start and the end of the ith
 * interval and intervals is sorted in ascending order by starti.
 *
 * You are also given an interval newInterval = [start, end] that represents
 * the start and end of another interval.
 *
 * Insert newInterval into intervals such that intervals is still sorted in
 * ascending order by starti and intervals still does not have any overlapping
 * intervals (merge overlapping intervals if necessary).
 *
 * Example 1:
 * Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
 * Output: [[1,5],[6,9]]
 *
 * Example 2:
 * Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
 * Output: [[1,2],[3,10],[12,16]]
 *
 * Constraints:
 * - 0 <= intervals.length <= 10^4
 * - intervals is sorted by starti in ascending order.
 */

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

  // 1. Add intervals that come BEFORE the new interval
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }

  // 2. Merge overlapping intervals
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);

  // 3. Add intervals that come AFTER the new interval
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
