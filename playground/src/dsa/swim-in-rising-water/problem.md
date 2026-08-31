# Swim in Rising Water (LeetCode #778)

You are given an n x n grid where grid[r][c] represents the elevation
at that cell.

At time t, the water level is t.

You can swim from cell A to cell B if:
```text
  - They are adjacent (up, down, left, right)
  - max(elevation along the path) <= t
```

Return the MINIMUM time t required to reach the bottom-right cell
from the top-left cell.

Example:

```text
  grid = [
    [0, 2],
    [1, 3]
  ]
```

```text
  Possible paths:
    0 → 1 → 3  → max elevation = 3
    0 → 2 → 3  → max elevation = 3
```

```text
  Output: 3
```

Constraints:
- 1 <= n <= 50
- 0 <= grid[r][c] <= n^2

## Intuition

This Is NOT About Distance

This problem is NOT asking:
```text
  "What is the shortest path?"
```

It is asking:
```text
  "What is the minimum possible MAX elevation encountered on a path?"
```

Key Insight (CRITICAL):

```text
  Path cost = MAX elevation on the path
```

## Not

```text
  Sum of elevations
  Number of steps
```

WHY DIJKSTRA STILL WORKS

Even though the cost is NOT additive, Dijkstra still applies because:

- Path cost is MONOTONIC:
```text
    extending a path can only INCREASE or KEEP the same max elevation
```

- Once we reach a cell with the minimum possible max elevation,
```text
  no future path can improve it
```

This preserves the Dijkstra invariant:

```text
  ➤ First time we pop a cell, its cost is FINAL.
```

REFRAMING THE PROBLEM (MENTAL MODEL)

Imagine:
- Water is rising slowly
- At time t, you can step only on cells with elevation ≤ t

Question becomes:
- At what minimum time does a path from start to end become possible?

This is equivalent to:
- Finding a path that minimizes the maximum elevation

ALGORITHM (Dijkstra with Max-Cost Relaxation)

State = (r, c)

dist[r][c] = minimum possible max elevation to reach (r, c)

Initialization:
- dist[0][0] = grid[0][0]

Transition:
- newCost = max(currCost, grid[nr][nc])

Use:
- Min-heap ordered by dist

Stop:
- First time reaching (n-1, n-1)

TIME & SPACE COMPLEXITY

Let:
- N = grid size

Time:  O(N^2 log N)
Space: O(N^2)

WHY THIS PROBLEM IS 🔴 VVIMP

Interviewers are testing:
- Do you know Dijkstra is NOT just for sums?
- Can you reason about monotonic cost functions?
- Can you explain WHY greedy ordering is valid?

Many candidates fail by:
- Trying BFS ❌
- Using sum of elevations ❌

Getting this right signals Staff-level understanding.
