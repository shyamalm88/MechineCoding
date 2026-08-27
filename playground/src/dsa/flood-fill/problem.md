# Flood Fill (LeetCode #733)

An image is represented by an m x n integer grid where image[i][j]
represents the pixel value of the image. Given a starting pixel (sr, sc)
and a new color, flood fill the image.

Flood fill = change the color of the starting pixel AND all connected
pixels of the same color (4-directionally: up, down, left, right).

Example 1:
Input:  image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]

Visual:
```text
  Before:           After:
  [1, 1, 1]         [2, 2, 2]
  [1, 1, 0]    →    [2, 2, 0]
  [1, 0, 1]         [2, 0, 1]
```

```text
  Starting at (1,1), all connected 1s become 2s.
  The bottom-right 1 is NOT connected (blocked by 0s).
```

Example 2:
Input:  image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0
Output: [[0,0,0],[0,0,0]] (no change - same color)

Constraints:
- m == image.length
- n == image[i].length
- 1 <= m, n <= 50
- 0 <= image[i][j], color < 2^16
- 0 <= sr < m, 0 <= sc < n
