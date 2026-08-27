# Path With Minimum Effort (LeetCode #1631)

> Path With Minimum Effort (LeetCode #1631)

You are a hiker preparing for an upcoming hike. You are given `heights`, a 2D
array of size rows x columns, where heights[r][c] represents the height of
cell (r, c).

You start at the top-left cell (0, 0) and want to reach the bottom-right cell
(rows-1, cols-1). From any cell, you may move:
```text
  - up
  - down
  - left
  - right
```

The effort of a route is defined as:
```text
  - the MAXIMUM absolute difference in heights between two consecutive cells
    along the route.
```

Your task is to find the minimum possible effort required to travel from
start to destination.

Example:
Input:
```text
  heights = [[1,2,2],
             [3,8,2],
             [5,3,5]]
```

Output: 2
