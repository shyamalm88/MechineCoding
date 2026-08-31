# Spiral Matrix (LeetCode #54)

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

## Approach

Four Boundary Pointers

## Intuition

Use four pointers to track the boundaries of the unvisited portion:
- top: uppermost unvisited row
- bottom: lowermost unvisited row
- left: leftmost unvisited column
- right: rightmost unvisited column

Traverse in 4 directions, shrinking boundaries after each direction:
1. Left → Right (along top row), then move top down
2. Top → Bottom (along right column), then move right left
3. Right → Left (along bottom row), then move bottom up
4. Bottom → Top (along left column), then move left right

Visual of boundaries shrinking:

```text
  Initial:          After top row:      After right col:
  top=0              top=1               top=1
  ┌─────────┐        ┌─────────┐         ┌─────────┐
  │ 1  2  3 │        │ ✓  ✓  ✓ │         │ ✓  ✓  ✓ │
  │ 4  5  6 │        │ 4  5  6 │         │ 4  5  ✓ │
  │ 7  8  9 │        │ 7  8  9 │         │ 7  8  ✓ │
  └─────────┘        └─────────┘         └─────────┘
  left=0  right=2    left=0  right=2     left=0  right=1
```

Time Complexity: O(m × n) - visit each cell exactly once
Space Complexity: O(1) - excluding output array (only pointers used)
