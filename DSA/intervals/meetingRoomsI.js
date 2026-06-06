/**
 * ============================================================================
 * PROBLEM: Meeting Rooms I (LeetCode #252)
 * ============================================================================
 * Given an array of meeting time intervals where intervals[i] = [start, end],
 * determine if a person can attend all meetings (no overlaps).
 *
 * Example 1:
 * Input: [[0,30],[5,10],[15,20]] → Output: false  (0-30 overlaps with 5-10)
 *
 * Example 2:
 * Input: [[7,10],[2,4]] → Output: true
 *
 * Constraints:
 * - 0 <= intervals.length <= 10^4
 * - intervals[i].length == 2
 * - 0 <= start_i < end_i <= 10^6
 */

// ============================================================================
// APPROACH: Sort by Start Time + Single Pass Check
// ============================================================================
/**
 * STORY / INTUITION:
 * If you lay all meetings on a timeline sorted by start time, overlap is only
 * possible between CONSECUTIVE meetings (a later meeting can't overlap with a
 * meeting two places back without also overlapping with the one in between).
 *
 * So: sort by start, then check if any meeting starts before the previous one ends.
 *
 * DRY RUN: [[0,30],[5,10],[15,20]] sorted → [[0,30],[5,10],[15,20]]
 * Compare [0,30] and [5,10]: 5 < 30 → OVERLAP → return false
 *
 * DRY RUN: [[7,10],[2,4]] sorted → [[2,4],[7,10]]
 * Compare [2,4] and [7,10]: 7 >= 4 → no overlap → return true
 *
 * Time:  O(N log N) for sort
 * Space: O(1)
 */
const canAttendMeetings = (intervals) => {
  intervals.sort((a, b) => a[0] - b[0]);

  for (let i = 1; i < intervals.length; i++) {
    // If next meeting starts before current meeting ends → conflict
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }

  return true;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Meeting Rooms I Tests ===\n");

console.log("Test 1:", canAttendMeetings([[0, 30], [5, 10], [15, 20]])); // Expected: false
console.log("Test 2:", canAttendMeetings([[7, 10], [2, 4]]));            // Expected: true
console.log("Test 3:", canAttendMeetings([]));                           // Expected: true
console.log("Test 4:", canAttendMeetings([[1, 5], [5, 10]]));            // Expected: true (touch, not overlap)

module.exports = { canAttendMeetings };
