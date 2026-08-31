# Set Matrix Zeroes (LeetCode #73)

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

## Approach 1

O(m + n) Space - Marker Sets

## Intuition

First pass: record which rows and which columns contain at least one 0,
using two sets. Second pass: zero out any cell whose row OR column was
marked.

## Dry run

[[1,1,1],[1,0,1],[1,1,1]]
 Pass 1: cell (1,1)=0 -> zeroRows={1}, zeroCols={1}
 Pass 2: every cell where row===1 or col===1 becomes 0
 Result: [[1,0,1],[0,0,0],[1,0,1]]

Time Complexity: O(m × n)
Space Complexity: O(m + n) for the two marker sets

## Approach 2

Optimal - O(1) Space

## Intuition

Instead of using extra arrays, use the FIRST ROW and FIRST COLUMN of the
matrix itself as markers!

Problem: The cell (0,0) is shared by both first row and first column.
Solution: Use two boolean flags to track if first row/column originally had 0s.

Steps:
1. Check if first row/column originally contain any 0s (save in flags)
2. Use first row/column as markers for the REST of the matrix
3. Zero out cells based on markers (skip first row/column)
4. Finally, zero out first row/column if needed based on flags

Visual of markers:
```text
       col0  col1  col2  col3
      ┌─────┬─────┬─────┬─────┐
```

row0  │ X   │ M   │ M   │ M   │  ← First row marks columns
```text
      ├─────┼─────┼─────┼─────┤
```

row1  │ M   │     │     │     │  ← First column marks rows
```text
      ├─────┼─────┼─────┼─────┤
```

row2  │ M   │     │     │     │
```text
      └─────┴─────┴─────┴─────┘
        ↑
   First col marks rows
```

Time Complexity: O(m × n) - multiple passes but still linear
Space Complexity: O(1) - only two boolean variables
