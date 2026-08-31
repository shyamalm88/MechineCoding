# Shortest Path in Binary Matrix (LeetCode #1091)

Given an n x n binary matrix grid, return the length of the shortest clear
path in the matrix. If there is no clear path, return -1.

A clear path in a binary matrix is a path from the top-left cell (0, 0) to
the bottom-right cell (n - 1, n - 1) such that:
1. All the visited cells of the path are 0.
2. All the adjacent cells of the path are 8-directionally connected
```text
   (i.e., they are different and share an edge or a corner).
```

The length of a clear path is the number of visited cells of this path.

Example 1:
Input: [[0,1],[1,0]]
Output: 2
Path: (0,0) -> (1,1)

Example 2:
Input: [[0,0,0],[1,1,0],[1,1,0]]
Output: 4
Path: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2)

Constraints:
- n == grid.length
- n == grid[i].length
- 1 <= n <= 100
- grid[i][j] is 0 or 1

## Approach

BFS (Breadth-First Search)

## Intuition

We are looking for the SHORTEST path in an unweighted grid (each step cost is 1).
This is a classic use case for BFS. DFS would explore one path deeply and
might find a path, but not necessarily the shortest one without checking all.
BFS explores layer by layer (distance 1, then distance 2, etc.), guaranteeing
the first time we reach the target, it is via the shortest path.

Key details:
- 8 Directions: Unlike standard mazes (4 directions), we can move diagonally.
- Visited Array: We can modify the input grid to mark visited cells (change 0 to 1)
```text
  to save space, or use a separate Set/Matrix. Here we modify in-place.
```

Time Complexity: O(N^2) - In worst case, we visit every cell once.
Space Complexity: O(N^2) - For the queue in worst case.
