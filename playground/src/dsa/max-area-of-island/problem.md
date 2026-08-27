# Max Area of Island (LeetCode #695)

> Max Area of Island (LeetCode #695)

You are given an m x n binary matrix grid. An island is a group of 1s
(representing land) connected 4-directionally (horizontal or vertical).
You may assume all four edges of the grid are surrounded by water.

The area of an island is the number of cells with a value 1 in the island.

Return the maximum area of an island in grid. If there is no island,
return 0.

Example 1:
Input: grid = [
```text
  [0,0,1,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,1,1,0,1,0,0,0,0,0,0,0,0],
  [0,1,0,0,1,1,0,0,1,0,1,0,0],
  [0,1,0,0,1,1,0,0,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,1,1,0,0,0,0]
```

]
Output: 6

Constraints:
- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 50
- grid[i][j] is either 0 or 1.

## Intuition

DFS (Sink the Island)

1. Iterate through every cell in the grid.
2. If we encounter a '1' (land), it means we found a new island.
3. Start a DFS traversal from that cell to find the full extent of the island.
4. During DFS:
```text
   - Count the current cell (area + 1).
   - Mark the cell as visited by setting it to '0' (sink it). This avoids
     infinite loops and counting the same island twice.
   - Recursively visit all 4 neighbors.
```

5. Keep track of the maximum area found so far.

Time Complexity: O(M * N) - We visit each cell at most a constant number of times.
Space Complexity: O(M * N) - Recursion stack in the worst case (all land).
