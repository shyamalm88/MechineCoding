# Number of Distinct Islands (LeetCode #694)

Given a binary grid, an island is a group of 1s connected 4-directionally.
Two islands are the SAME if one can be translated (moved, NOT rotated or
reflected) to equal the other. Return the number of DISTINCT island shapes.

Example 1:
Input:
```text
  [[1,1,0,0,0],
   [1,1,0,0,0],
   [0,0,0,1,1],
   [0,0,0,1,1]]
```

Output: 1   (both islands are the same 2x2 square)

Example 2:
Input:
```text
  [[1,1,0,1,1],
   [1,0,0,0,0],
   [0,0,0,0,1],
   [1,1,0,1,1]]
```

Output: 3

Constraints:
- 1 <= m, n <= 50
- grid[i][j] is 0 or 1
