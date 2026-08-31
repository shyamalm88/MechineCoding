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

## Approach

DFS + Multi-Source BFS

## Intuition

This is a two-step problem. First, we need to find one of the islands to
start our search from. Then, we need to find the shortest path from that
island to the other one.

1. Find Island 1 (DFS): We can iterate through the grid until we find a '1'.
```text
   Once found, we use DFS to explore the entire island, marking its cells
   (e.g., changing '1' to '2') and adding all its cells to a queue.
```

2. Find Shortest Path (BFS): Now, the queue contains all the cells of the
```text
   first island. This is a "multi-source" BFS. We expand outwards from all
   these cells simultaneously, layer by layer. Each layer represents one
   flipped '0'. The first time we encounter a '1' (the second island),
   the current layer count is our shortest bridge length.
```

Time Complexity: O(N^2) - We visit every cell at most a constant number of times.
Space Complexity: O(N^2) - For the queue and recursion stack in the worst case.
