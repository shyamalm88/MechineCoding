/**
 * ============================================================================
 * PROBLEM: Merge Intervals (LeetCode #56)
 * ============================================================================
 * Given an array of intervals where intervals[i] = [starti, endi], merge all
 * overlapping intervals, and return an array of the non-overlapping intervals
 * that cover all the intervals in the input.
 *
 * Example 1:
 * Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
 * Output: [[1,6],[8,10],[15,18]]
 * Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
 *
 * Example 2:
 * Input: intervals = [[1,4],[4,5]]
 * Output: [[1,5]]
 * Explanation: Intervals [1,4] and [4,5] are considered overlapping.
 *
 * Constraints:
 * - 1 <= intervals.length <= 10^4
 * - intervals[i].length == 2
 * - 0 <= starti <= endi <= 10^4
 */

// ============================================================================
// APPROACH: Sorting
// ============================================================================
/**
 * INTUITION:
 * If we sort the intervals by their start time, overlapping intervals will
 * be adjacent in the sorted list.
 * We can iterate through the sorted list and merge the current interval with
 * the previous one if they overlap (current.start <= previous.end).
 *
 * Time Complexity: O(N log N) - Due to sorting.
 * Space Complexity: O(N) - To store the result (or O(log N) for sort stack).
 *
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  if (intervals.length === 0) return [];

  // 1. Create a copy using spread syntax [...] or .slice()
  // This prevents mutating the original data passed by the caller.
  const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0]);

  const result = [sortedIntervals[0]];

  for (let i = 1; i < sortedIntervals.length; i++) {
    const current = sortedIntervals[i];
    const lastMerged = result[result.length - 1];

    // 2. Logic remains the same: Check Overlap
    if (current[0] <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      result.push(current);
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Merge Intervals Tests ===\n");

console.log(
  "Test 1:",
  merge([
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ])
); // Expected: [[1,6],[8,10],[15,18]]

console.log(
  "Test 2:",
  merge([
    [1, 4],
    [4, 5],
  ])
); // Expected: [[1,5]]

module.exports = { merge };
