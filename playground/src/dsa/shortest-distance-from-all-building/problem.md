# Shortest Distance from All Buildings (LeetCode #317)

## Category

🔵 CORE (Multi-Source Shortest Path / BFS vs Dijkstra Decision)

You are given an m x n grid where:
- 0 = empty land
- 1 = building
- 2 = obstacle

You want to build a house on an empty land such that the SUM of distances
from this land to ALL buildings is minimized.

You can move:
- up, down, left, right
- each move costs 1 distance unit

Return the minimum total distance.
If it is not possible to reach all buildings, return -1.

Example:

```text
  Input:
  [
    [1, 0, 2, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0]
  ]
```

```text
  Buildings at (0,0), (0,4), (2,2)
```

```text
  Best empty land = (1,2)
```

```text
  Distances:
    (1,2) → (0,0) = 3
    (1,2) → (0,4) = 3
    (1,2) → (2,2) = 1
```

```text
  Total = 7
```

```text
  Output: 7
```

Constraints:
- m, n <= 50
- grid[i][j] ∈ {0, 1, 2}
- At least one building

## Intuition

Sum of Distances to Multiple Sources

This is NOT a single-source shortest path problem.

Instead, think:
- For EACH building:
```text
    → compute distance to every reachable empty cell
```

- Then:
```text
    → for each empty cell, sum distances from ALL buildings
```

The answer is:
```text
  min over all empty cells (sum of distances from all buildings)
```

Key Insight (VERY IMPORTANT):
- All edges have weight = 1
- So we should use BFS, NOT Dijkstra

Using Dijkstra here would be correct but inefficient and unnecessary.

WHY MULTI-SOURCE BFS IS THE RIGHT MODEL

We are effectively doing:
```text
  B separate BFS traversals (one from each building)
```

During BFS:
- We track distance to empty lands
- Accumulate total distances
- Count how many buildings can reach each empty cell

Only cells reachable from ALL buildings are valid candidates.

ALGORITHM

Let:
- totalDist[r][c] = sum of distances from all buildings
- reachCount[r][c] = number of buildings that can reach this cell

Steps:

1. Initialize totalDist and reachCount to 0
2. Count total number of buildings = B
3. For each building:
```text
     a. BFS from building
     b. Track visited cells for this BFS
     c. For each empty cell reached:
          - totalDist += distance
          - reachCount += 1
```

4. After all BFS runs:
```text
     - For each empty cell:
          if reachCount == B:
             consider totalDist
```

5. Return minimum totalDist, or -1 if none valid

TIME & SPACE COMPLEXITY

Let:
- B = number of buildings
- R = rows, C = cols

Time:
```text
  O(B × R × C)
```

Space:
```text
  O(R × C)
```

WHY THIS PROBLEM IS 🔵 CORE

Interviewers test:
- Can you recognize BFS instead of Dijkstra?
- Can you reason about multi-source shortest paths?
- Can you aggregate distances correctly?

Many candidates FAIL by:
- Running Dijkstra from every empty cell ❌
- Forgetting to check reachability from all buildings ❌

Getting this right shows strong fundamentals.
