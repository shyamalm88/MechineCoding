# Rotate Image (LeetCode #48)

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

## Approach

Transpose + Reverse

## Intuition

A 90° clockwise rotation can be achieved in two steps:
1. TRANSPOSE: Swap rows and columns (element at [i][j] goes to [j][i])
2. REVERSE: Reverse each row

Visual breakdown:

```text
  Original:        After Transpose:    After Reverse Rows:
  [1, 2, 3]        [1, 4, 7]           [7, 4, 1]
  [4, 5, 6]   →    [2, 5, 8]      →    [8, 5, 2]
  [7, 8, 9]        [3, 6, 9]           [9, 6, 3]
```

Why this works:
- Transpose mirrors the matrix along its main diagonal
- Reversing rows then flips it horizontally
- Combined effect = 90° clockwise rotation

Alternative rotations:
- 90° counter-clockwise: Transpose → Reverse columns (or Reverse rows → Transpose)
- 180°: Reverse rows → Reverse columns

Time Complexity: O(n²) - visit each element twice
Space Complexity: O(1) - in-place swaps, no extra space
