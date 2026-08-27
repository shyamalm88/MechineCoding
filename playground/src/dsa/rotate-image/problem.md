# Rotate Image (LeetCode #48)

> Rotate Image (LeetCode #48)

You are given an n x n 2D matrix representing an image. Rotate the image
by 90 degrees clockwise. You must rotate it IN-PLACE.

Example 1:
Input:  [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]

Visual:
```text
  Before:          After (90° clockwise):
  [1, 2, 3]        [7, 4, 1]
  [4, 5, 6]   →    [8, 5, 2]
  [7, 8, 9]        [9, 6, 3]
```

Example 2:
Input:  [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]

Constraints:
- n == matrix.length == matrix[i].length
- 1 <= n <= 20
- -1000 <= matrix[i][j] <= 1000
