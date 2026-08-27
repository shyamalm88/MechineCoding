# Walls and Gates (LeetCode #286)

> Walls and Gates (LeetCode #286)

You are given an m x n grid rooms initialized with these three possible values:
- -1: A wall or an obstacle.
- 0: A gate.
- INF: Infinity means an empty room. We use the value 2^31 - 1 = 2147483647
```text
  to represent INF as you may assume that the distance to a gate is less
  than 2147483647.
```

Fill each empty room with the distance to its nearest gate. If it is
impossible to reach a gate, it should be filled with INF.

Example 1:
Input: rooms = [
```text
  [2147483647, -1, 0, 2147483647],
  [2147483647, 2147483647, 2147483647, -1],
  [2147483647, -1, 2147483647, -1],
  [0, -1, 2147483647, 2147483647]
```

]
Output: [
```text
  [3, -1, 0, 1],
  [2, 2, 1, -1],
  [1, -1, 2, -1],
  [0, -1, 3, 4]
```

]

Constraints:
- m == rooms.length
- n == rooms[i].length
- 1 <= m, n <= 250
- rooms[i][j] is -1, 0, or 2^31 - 1.

## Intuition

Multi-Source BFS

Why Multi-Source BFS?
- If we start BFS from each empty room to find the nearest gate, it would
```text
  be very inefficient (O(k * m * n) where k is number of empty rooms).
```

- Instead, we can start BFS from ALL gates simultaneously.
- The moment we reach an empty room from ANY gate, that is the shortest
```text
  distance to a gate.
```

Algorithm:
1. Traverse the grid to find all gates (0).
2. Add all gates to the queue as the starting points (distance 0).
3. Perform BFS:
```text
   - Pop a cell (r, c).
   - Check all 4 neighbors.
   - If a neighbor is an empty room (INF), update its distance to
     current_dist + 1 and add to queue.
   - If a neighbor is a wall (-1) or already visited (distance < INF), skip.
```

Time Complexity: O(M * N) - Each cell is visited at most once.
Space Complexity: O(M * N) - Queue size in worst case.
