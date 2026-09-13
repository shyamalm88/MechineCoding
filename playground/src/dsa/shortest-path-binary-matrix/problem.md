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
Path: (0,0) -> (0,1) -> (1,2) -> (2,2)   (the last step is diagonal)

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

## Approach 2

DFS (Backtracking) -- correct, but exponential

## Intuition

DFS goes deep down one route before trying another, so the first path it
reaches the target on is just SOME path, not the shortest. To get the right
answer, DFS has to try every simple path and keep the minimum.

The trap -- marking visited and never unmarking:
In BFS, a cell is marked visited forever, which is safe because BFS reaches
every cell by its shortest route first. In DFS that is wrong: a long route
may mark cells that a shorter route needs later, so the shorter route is
never explored. On a fully open 3x3 grid that version returns 5, but the
real answer is 3.

So the DFS must BACKTRACK: mark a cell on the way in, unmark it on the way
out. Then the cell is only blocked for the path currently being built.

Pruning: once a path of length `shortest` is known, any path that has
already reached that length cannot do better, so stop exploring it.

Time Complexity: exponential. DFS enumerates simple paths, and there can be
exponentially many. A loose upper bound is O(8^(N^2)): up to 8 choices per
step, over a path that can touch up to N^2 cells. Pruning cuts a lot of work
but does not change the growth class. Measured recursive calls on fully
open grids (with pruning):
```text
    3x3: 72     5x5: 3,667     7x7: 158,592     8x8: 1,021,395
```

roughly 6-7x more work per +1 in grid size. At N = 100 it will not finish.

Space Complexity: O(N^2) for the visited matrix, plus recursion depth up to
N^2 (a path can snake through every open cell). At N = 100 that is up to
10,000 stack frames, which can also overflow the call stack.

Why BFS is the answer for this problem:
every step costs 1, so BFS reaches each cell first by its shortest route --
O(N^2) time. DFS is worth knowing mainly to explain why it is the wrong tool
for shortest paths.
