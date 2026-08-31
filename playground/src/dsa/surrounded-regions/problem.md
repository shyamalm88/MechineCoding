# Surrounded Regions (LeetCode #130)

Given an m x n matrix board containing 'X' and 'O', capture all regions
that are 4-directionally surrounded by 'X'.

A region is captured by flipping all 'O's into 'X's in that surrounded region.

Example 1:
Input: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
Explanation: The 'O' in the bottom row is not surrounded because it's on the border.

Constraints:
- m == board.length
- n == board[i].length
- 1 <= m, n <= 200
- board[i][j] is 'X' or 'O'.

## Approach

DFS from Borders (Reverse Thinking)

## Intuition

Instead of finding surrounded 'O's, it's easier to find *unsurrounded* 'O's.
An 'O' is unsurrounded if it's on the border or connected to an 'O' on the border.

1. Start DFS/BFS from every 'O' on the four borders.
2. Mark all reachable 'O's from the borders with a temporary marker (e.g., 'E' for Escaped).
3. Iterate through the entire grid again:
```text
   - If a cell is 'O' (it wasn't reached from a border), flip it to 'X'.
   - If a cell is 'E', flip it back to 'O'.
```

Time Complexity: O(M * N)
Space Complexity: O(M * N) for the recursion stack in the worst case.
