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

## Approach

Bottom-Up DP (in-place, O(N) space)

## Story / intuition

Start from the BOTTOM row. Each cell knows the best it can do from here.
Work upwards: for each cell, best path = its value + min(child below-left, child below-right).
When we reach the top, dp[0] holds the answer.

WHY BOTTOM-UP? Avoids tracking the path, and we can reuse a single row array.

## Dry run

[[2],[3,4],[6,5,7],[4,1,8,3]]
Start: dp = [4,1,8,3] (last row)
Row 2 ([6,5,7]):
```text
  dp[0] = 6 + min(4,1) = 7
  dp[1] = 5 + min(1,8) = 6
  dp[2] = 7 + min(8,3) = 10
  dp = [7,6,10]
```

Row 1 ([3,4]):
```text
  dp[0] = 3 + min(7,6) = 9
  dp[1] = 4 + min(6,10) = 10
  dp = [9,10]
```

Row 0 ([2]):
```text
  dp[0] = 2 + min(9,10) = 11
```

Result: 11 ✓

Time:  O(N²) where N = number of rows
Space: O(N) — just one row at a time
