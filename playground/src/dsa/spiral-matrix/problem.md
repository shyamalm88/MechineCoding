# Spiral Matrix (LeetCode #54)

> Spiral Matrix (LeetCode #54)

Given an m x n matrix, return all elements of the matrix in spiral order.

Example 1:
Input:  [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]

Visual:
```text
  [1, 2, 3]
  [4, 5, 6]  →  [1,2,3,6,9,8,7,4,5]
  [7, 8, 9]
```

```text
  Traversal pattern:
  1 → 2 → 3
          ↓
  4 → 5   6
  ↑       ↓
  7 ← 8 ← 9
```

Example 2:
Input:  [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]

Constraints:
- m == matrix.length
- n == matrix[i].length
- 1 <= m, n <= 10
- -100 <= matrix[i][j] <= 100
