# Shortest Path with Obstacles Elimination (LeetCode #1293)

## Category

🟢 IMPORTANT (Grid BFS with State Expansion)

You are given an m x n grid where:
- 0 = empty cell
- 1 = obstacle

You start at the top-left corner (0,0) and want to reach
the bottom-right corner (m-1, n-1).

You can move in 4 directions:
- up, down, left, right
- each move costs 1 step

You are also given an integer k, representing the maximum number
of obstacles you are allowed to eliminate.

Return the MINIMUM number of steps required to reach the destination.
If it is not possible, return -1.

Example 1:

```text
  grid = [
    [0,0,0],
    [1,1,0],
    [0,0,0],
    [0,1,1],
    [0,0,0]
  ]
  k = 1
```

```text
  Output: 6
```

Example 2:

```text
  grid = [[0,1,1],[1,1,1],[1,0,0]]
  k = 1
```

```text
  Output: -1
```

Constraints:
- 1 <= m, n <= 40
- 1 <= k <= m * n

## Intuition

Why Plain BFS Is NOT Enough

This looks like a shortest path on a grid → BFS, right?

Not quite.

The twist:
- You can remove obstacles, but only k times

Key Insight (VERY IMPORTANT):

```text
  Reaching the SAME cell with DIFFERENT remaining eliminations
  are DIFFERENT STATES.
```

So:
```text
  (r, c, remainingK = 2)  ≠  (r, c, remainingK = 0)
```

A simple visited[r][c] is WRONG.

STATE MODELING

State = (row, col, remainingEliminations)

BFS is still valid because:
- Every move costs exactly 1
- We want the minimum number of steps

The only change:
- visited must track remaining eliminations

ALGORITHM (BFS with State)

1. Use a queue for BFS:
```text
     [row, col, remainingK, steps]
```

2. visited[r][c][k]:
```text
     whether we have visited cell (r, c) with k eliminations left
```

3. Start from (0,0,k,0)

4. For each move:
```text
     - If next cell is empty (0): remainingK stays same
     - If next cell is obstacle (1):
          → can move ONLY if remainingK > 0
          → remainingK decreases by 1
```

5. First time reaching destination is the shortest path

TIME & SPACE COMPLEXITY

Let:
- R = rows
- C = cols

States = R × C × (k + 1)

Time:  O(R × C × k)
Space: O(R × C × k)

WHY THIS PROBLEM IS 🟢 IMPORTANT

Interviewers are testing:
- Can you recognize state-space BFS?
- Do you know when visited[r][c] is insufficient?
- Can you manage exponential-looking state safely?

This problem is a direct cousin of:
- Teleport / power-up problems
- One-time ability shortest path problems

Getting this right is a strong senior signal.
