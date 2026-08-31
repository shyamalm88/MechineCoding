# Meeting Rooms II (LeetCode #253)

Given an array of meeting time intervals intervals where intervals[i] = [starti, endi],
return the minimum number of conference rooms required.

Example 1:
Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2

Example 2:
Input: intervals = [[7,10],[2,4]]
Output: 1

Constraints:
- 1 <= intervals.length <= 10^4
- 0 <= starti < endi <= 10^6

## Approach

Chronological Ordering (Two Pointers)

## Intuition

Instead of viewing meetings as blocks, view them as "Events" in time.
- When a meeting starts, we need a room (+1).
- When a meeting ends, a room frees up (-1).

We separate Start times and End times and sort them individually.
We iterate through the Start times. If a meeting starts BEFORE the earliest
ending meeting finishes, we need a new room. Otherwise, we can reuse the room
that just freed up (increment the end pointer).

Time Complexity: O(N log N) - Sorting start and end arrays.
Space Complexity: O(N) - To store start and end arrays.

@param {number[][]} intervals
@return {number}
