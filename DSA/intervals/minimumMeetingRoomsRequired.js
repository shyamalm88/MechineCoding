/**
 * ============================================================================
 * PROBLEM: Meeting Rooms II (LeetCode #253)
 * ============================================================================
 * Given an array of meeting time intervals intervals where intervals[i] = [starti, endi],
 * return the minimum number of conference rooms required.
 *
 * Example 1:
 * Input: intervals = [[0,30],[5,10],[15,20]]
 * Output: 2
 *
 * Example 2:
 * Input: intervals = [[7,10],[2,4]]
 * Output: 1
 *
 * Constraints:
 * - 1 <= intervals.length <= 10^4
 * - 0 <= starti < endi <= 10^6
 */

// ============================================================================
// APPROACH: Chronological Ordering (Two Pointers)
// ============================================================================
/**
 * INTUITION:
 * Instead of viewing meetings as blocks, view them as "Events" in time.
 * - When a meeting starts, we need a room (+1).
 * - When a meeting ends, a room frees up (-1).
 *
 * We separate Start times and End times and sort them individually.
 * We iterate through the Start times. If a meeting starts BEFORE the earliest
 * ending meeting finishes, we need a new room. Otherwise, we can reuse the room
 * that just freed up (increment the end pointer).
 *
 * Time Complexity: O(N log N) - Sorting start and end arrays.
 * Space Complexity: O(N) - To store start and end arrays.
 *
 * @param {number[][]} intervals
 * @return {number}
 */
var minMeetingRooms = function (intervals) {
  if (intervals.length === 0) return 0;

  // 1. Separate and Sort
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let rooms = 0;
  let endPtr = 0;

  // 2. Loop from i = 0 (Check EVERY meeting)
  for (let i = 0; i < starts.length; i++) {
    // 3. Collision Logic
    if (starts[i] < ends[endPtr]) {
      // A meeting started before the earliest one ended.
      // We need a NEW room.
      rooms++;
    } else {
      // A meeting ended. We reuse that room.
      // We do NOT increment rooms.
      // We shift endPtr to the next available slot.
      endPtr++;
    }
  }

  return rooms;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Meeting Rooms II Tests ===\n");

console.log(
  "Test 1:",
  minMeetingRooms([
    [0, 30],
    [5, 10],
    [15, 20],
  ])
); // Expected: 2

console.log(
  "Test 2:",
  minMeetingRooms([
    [7, 10],
    [2, 4],
  ])
); // Expected: 1

module.exports = { minMeetingRooms };
