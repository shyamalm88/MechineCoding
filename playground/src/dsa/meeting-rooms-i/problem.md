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
