# Triangle (LeetCode #120)

Given a triangle array, return the minimum path sum from top to bottom.
At each step you may move to adjacent numbers on the row below
(triangle[i][j] can go to triangle[i+1][j] or triangle[i+1][j+1]).

Example 1:
Input: [[2],[3,4],[6,5,7],[4,1,8,3]]
Output: 11 → path: 2→3→5→1

Example 2:
Input: [[-10]] → Output: -10

Constraints:
- 1 <= triangle.length <= 200
- triangle[i].length == i + 1
- -10^4 <= triangle[i][j] <= 10^4
