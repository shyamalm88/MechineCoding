# Minimum Path Sum (LeetCode #64)

You are given an m x n grid filled with non-negative numbers.

You start at the top-left cell (0,0).
You want to reach the bottom-right cell (m-1,n-1).

You can move ONLY:
- right
- down

Each cell adds its value to the path cost.

Return the MINIMUM path sum.

Example:

```text
  grid = [
    [1,3,1],
    [1,5,1],
    [4,2,1]
  ]
```

```text
  Path:
    1 → 3 → 1 → 1 → 1
```

```text
  Output: 7
```

Constraints:
- 1 <= m, n <= 200
- grid[i][j] >= 0

## Intuition

This Is NOT a Graph Problem (Even Though It Looks Like One)

Many people think:
```text
  “This is shortest path → Dijkstra”
```

That is OVERKILL.

Key Insight (VERY IMPORTANT):

```text
  Movement is restricted:
    - only right
    - only down
```

That means:
- There are NO cycles
- Every cell depends ONLY on:
```text
    → top cell
    → left cell
```

This is a DIRECTED ACYCLIC GRAPH (DAG).

DP is the simplest and most optimal solution.

DP STATE DEFINITION

Let:
```text
  dp[r][c] = minimum path sum to reach cell (r, c)
```

Goal:
```text
  dp[m-1][n-1]
```

DP TRANSITION

To reach cell (r, c):
- You must come from:
```text
    → (r-1, c)  [top]
    → (r, c-1)  [left]
```

So:

```text
  dp[r][c] =
    grid[r][c] +
    min(dp[r-1][c], dp[r][c-1])
```

BASE CASES

dp[0][0] = grid[0][0]

First row:
```text
  dp[0][c] = grid[0][c] + dp[0][c-1]
```

First column:
```text
  dp[r][0] = grid[r][0] + dp[r-1][0]
```

ORDER OF COMPUTATION (IMPORTANT)

We must compute:
- row by row
- left to right
- top to bottom

Because:
- dp[r][c] depends on already-computed states

SPACE OPTIMIZATION (OPTIONAL DISCUSSION)

We only need:
- previous row
- current row

But for clarity, we’ll keep full 2D DP.

ALGORITHM

1. Create dp[m][n]
2. Initialize first cell, row, and column
3. Fill the rest using transition
4. Return dp[m-1][n-1]

TIME & SPACE COMPLEXITY

Time:  O(m × n)
Space: O(m × n)

WHY THIS PROBLEM IS 🟢 IMPORTANT

Interviewers are testing:
- Can you recognize a DAG DP?
- Can you avoid unnecessary Dijkstra?
- Do you define state & transition cleanly?

This is one of the CLEANEST DP problems.
