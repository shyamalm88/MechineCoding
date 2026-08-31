# Meeting Rooms I (LeetCode #252)

Given an array of meeting time intervals where intervals[i] = [start, end],
determine if a person can attend all meetings (no overlaps).

Example 1:
Input: [[0,30],[5,10],[15,20]] → Output: false  (0-30 overlaps with 5-10)

Example 2:
Input: [[7,10],[2,4]] → Output: true

Constraints:
- 0 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= start_i < end_i <= 10^6

## Approach

Sort by Start Time + Single Pass Check

## Story / intuition

If you lay all meetings on a timeline sorted by start time, overlap is only
possible between CONSECUTIVE meetings (a later meeting can't overlap with a
meeting two places back without also overlapping with the one in between).

So: sort by start, then check if any meeting starts before the previous one ends.

## Dry run

[[0,30],[5,10],[15,20]] sorted → [[0,30],[5,10],[15,20]]
Compare [0,30] and [5,10]: 5 < 30 → OVERLAP → return false

## Dry run

[[7,10],[2,4]] sorted → [[2,4],[7,10]]
Compare [2,4] and [7,10]: 7 >= 4 → no overlap → return true

Time:  O(N log N) for sort
Space: O(1)
