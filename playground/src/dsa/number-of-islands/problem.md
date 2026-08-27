# Number of Islands (LeetCode #200)

Given an m x n 2D binary grid which represents a map of '1's (land)
and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent
lands horizontally or vertically. You may assume all four edges of the
grid are all surrounded by water.

Example 1:
```text
  1 1 1 1 0
  1 1 0 1 0
  1 1 0 0 0      Output: 1
  0 0 0 0 0
```

Example 2:
```text
  1 1 0 0 0
  1 1 0 0 0      Output: 3
  0 0 1 0 0
  0 0 0 1 1
```

Constraints:
- m == grid.length, n == grid[i].length
- 1 <= m, n <= 300
- grid[i][j] is '0' or '1'

## Intuition

Island Sinking with DFS

1. Scan the grid cell by cell
2. When we find a '1' (land), we found a NEW island -> count++
3. Use DFS to "sink" the entire island (turn all connected '1's to '0's)
4. This prevents counting the same island twice

Why mutate grid? Saves O(M*N) space vs using a separate visited set.

Time Complexity: O(M * N) - visit each cell at most once
Space Complexity: O(M * N) - recursion stack in worst case
