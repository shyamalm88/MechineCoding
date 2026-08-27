# Maximal Square (LeetCode #221)

> Maximal Square (LeetCode #221)

## Category

🔴 VVIMP (2D DP / Local-to-Global Invariant)

You are given an m x n binary matrix filled with:
- '0'
- '1'

Return the AREA of the largest square containing only '1's.

Example:

```text
  matrix = [
    ["1","0","1","0","0"],
    ["1","0","1","1","1"],
    ["1","1","1","1","1"],
    ["1","0","0","1","0"]
  ]
```

```text
  Largest square:
    [
      1 1
      1 1
    ]
```

```text
  Side length = 2
  Area = 4
```

Constraints:
- 1 <= m, n <= 300

## Intuition

Why This Is NOT Just Counting 1s

We are NOT asking:
```text
  “How many 1s are connected?”
```

We ARE asking:
```text
  “What is the largest ALL-1 SQUARE?”
```

Key Insight (CRITICAL):

```text
  A square is defined by its BOTTOM-RIGHT corner.
```

If we know the largest square ending at (r, c),
we can grow larger squares.

DP STATE DEFINITION

Let:
```text
  dp[r][c] = side length of the largest square
             whose bottom-right corner is at (r, c)
```

Goal:
```text
  max(dp[r][c])²
```

BASE CASES

If matrix[r][c] === '0':
```text
  dp[r][c] = 0
```

First row or first column:
- dp[r][c] = 1 if matrix[r][c] === '1'

DP TRANSITION (THE CORE IDEA)

If matrix[r][c] === '1':

```text
  dp[r][c] =
    1 + min(
      dp[r-1][c],     // top
      dp[r][c-1],     // left
      dp[r-1][c-1]    // top-left (diagonal)
    )
```

Why min?

To form a square of size k at (r, c):
- All THREE neighboring squares must support size k-1

The smallest one LIMITS growth.

MENTAL MODEL (VERY IMPORTANT)

Think locally:

```text
  “How big a square can I END here?”
```

You don’t care about distant cells.
Only these three neighbors matter.

This local invariant builds the global answer.

ORDER OF COMPUTATION

dp[r][c] depends on:
- top
- left
- top-left

So:
- Iterate row by row
- Left to right

ALGORITHM

1. Create dp[m][n] initialized to 0
2. Track maxSide = 0
3. For each cell:
```text
     If matrix[r][c] === '1':
       dp[r][c] = 1 + min(top, left, diag)
       maxSide = max(maxSide, dp[r][c])
```

4. Return maxSide * maxSide

TIME & SPACE COMPLEXITY

Time:  O(m × n)
Space: O(m × n)

WHY THIS PROBLEM IS 🔴 VVIMP

Interviewers are testing:
- Can you define DP state precisely?
- Do you understand why diagonal matters?
- Can you explain the MIN invariant?

This is a CLASSIC Google DP problem.
