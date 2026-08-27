# Rotting Oranges (LeetCode #994)

> Rotting Oranges (LeetCode #994)

You are given an m x n grid where each cell can have one of three values:
```text
  0 - Empty cell
  1 - Fresh orange
  2 - Rotten orange
```

Every minute, any fresh orange that is 4-directionally adjacent to a
rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has
a fresh orange. If this is impossible, return -1.

Example 1:
```text
  2 1 1      2 2 1      2 2 2      2 2 2      2 2 2
  1 1 0  ->  2 1 0  ->  2 2 0  ->  2 2 0  ->  2 2 0
  0 1 1      0 1 1      0 1 1      0 2 1      0 2 2
  t=0        t=1        t=2        t=3        t=4
```

Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4

Example 2:
Input: grid = [[2,1,1],[0,1,1],[1,0,1]]
Output: -1 (bottom-left orange is isolated)

Constraints:
- m == grid.length, n == grid[i].length
- 1 <= m, n <= 10
- grid[i][j] is 0, 1, or 2

## Intuition

Multi-Source BFS (Level-Order)

Why BFS not DFS?
- We need SIMULTANEOUS spread from ALL rotten oranges
- BFS processes level-by-level (all oranges at same distance together)
- DFS would go deep first, not spread evenly

Algorithm:
1. Find all rotten oranges (sources) and count fresh oranges
2. BFS: Process one "wave" per minute
3. Each wave infects adjacent fresh oranges
4. Stop when no fresh oranges left OR queue empty

Time Complexity: O(M * N) - visit each cell at most once
Space Complexity: O(M * N) - queue can hold all cells
