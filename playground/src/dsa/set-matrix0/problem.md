# Set Matrix Zeroes (LeetCode #73)

> Set Matrix Zeroes (LeetCode #73)

Given an m x n integer matrix, if an element is 0, set its entire row and
column to 0's. You must do it in place.

Example 1:
Input:  [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]

Visual:
```text
  Before:        After:
  [1, 1, 1]      [1, 0, 1]
  [1, 0, 1]  →   [0, 0, 0]
  [1, 1, 1]      [1, 0, 1]
```

Example 2:
Input:  [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

Constraints:
- m == matrix.length
- n == matrix[0].length
- 1 <= m, n <= 200
- -2^31 <= matrix[i][j] <= 2^31 - 1

Follow up:
- Can you solve it with O(mn) space? (Brute force)
- Can you solve it with O(m + n) space? (Use marker arrays)
- Can you solve it with O(1) space? (Use first row/column as markers)
