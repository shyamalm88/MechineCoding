# 01 Matrix (LeetCode #542)

Given an m x n binary matrix mat, return the distance of the nearest 0 for
each cell.

The distance between two adjacent cells is 1.

Example 1:
Input: mat = [[0,0,0],[0,1,0],[0,0,0]]
Output: [[0,0,0],[0,1,0],[0,0,0]]

Example 2:
Input: mat = [[0,0,0],[0,1,0],[1,1,1]]
Output: [[0,0,0],[0,1,0],[1,2,1]]

Constraints:
- m == mat.length
- n == mat[i].length
- 1 <= m, n <= 10^4
- 1 <= m * n <= 10^4
- mat[i][j] is either 0 or 1.
- There is at least one 0 in mat.

## Intuition

Multi-Source BFS

This problem is equivalent to finding the shortest path from each '1' to
the nearest '0'.

Instead of running BFS from every '1' (which would be inefficient), we can
think of this in reverse: Start BFS from ALL '0's simultaneously.

Algorithm:
1. Initialize a distance matrix with Infinity (representing unvisited).
2. Iterate through the grid. If a cell is 0, set its distance to 0 and
```text
   add it to the queue.
```

3. Perform BFS:
```text
   - Pop a cell (r, c).
   - Check its 4 neighbors.
   - If a neighbor has not been visited (distance is Infinity), set its
     distance to current_dist + 1 and add to queue.
```

This ensures that when we first reach a '1', it is via the shortest path
from a '0'.

Time Complexity: O(M * N) - Each cell is processed at most once.
Space Complexity: O(M * N) - For the queue and distance matrix.
