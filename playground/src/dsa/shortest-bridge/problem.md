# Shortest Bridge (LeetCode #934)

You are given an n x n binary matrix grid where 1 represents land and 0
represents water.

An island is a 4-directionally connected group of 1s not connected to any
other 1s. There are exactly two islands in grid.

You may change 0s to 1s to connect the two islands to form one island.
Return the smallest number of 0s you must flip to connect the two islands.

Example 1:
Input: grid = [[0,1],[1,0]]
Output: 1

Example 2:
Input: grid = [[0,1,0],[0,0,0],[0,0,1]]
Output: 2

Constraints:
- n == grid.length == grid[i].length
- 2 <= n <= 100
- grid[i][j] is 0 or 1.
- There are exactly two islands in grid.
