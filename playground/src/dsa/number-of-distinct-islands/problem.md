# Number of Distinct Islands (LeetCode #694)

Given a binary grid, an island is a group of 1s connected 4-directionally.
Two islands are the SAME if one can be translated (moved, NOT rotated or
reflected) to equal the other. Return the number of DISTINCT island shapes.

Example 1:
Input:
```text
  [[1,1,0,0,0],
   [1,1,0,0,0],
   [0,0,0,1,1],
   [0,0,0,1,1]]
```

Output: 1   (both islands are the same 2x2 square)

Example 2:
Input:
```text
  [[1,1,0,1,1],
   [1,0,0,0,0],
   [0,0,0,0,1],
   [1,1,0,1,1]]
```

Output: 3

Constraints:
- 1 <= m, n <= 50
- grid[i][j] is 0 or 1

## Approach

DFS Flood Fill + a Canonical Path Signature

## Story / intuition

Number of Islands answers "how many"; this asks "how many SHAPES". The flood
fill is identical — the new work is describing a shape in a way that is
identical for two translated copies.

Recording absolute coordinates fails immediately: the same square at (0,0) and
at (2,3) produces different lists. What IS translation-invariant is the PATH
the DFS walks. Start every island's walk at its first-discovered cell and
record the direction of each step — D, U, R, L. Two islands of the same shape,
explored in the same fixed neighbour order, generate the identical string.

## The bug everyone hits

recording only the moves is not enough. Without a
marker for RETURNING from a dead end, distinct shapes collide. Consider a
three-cell L and a three-cell line — both can emit "SDD"-like strings if the
backtracking is invisible. Push a 'B' when a call returns and the signature
becomes unambiguous, because it now encodes the tree structure of the walk,
not just the cells visited.

## Dry run

the 2x2 square at rows 0-1, cols 0-1
```text
  start (0,0) 'S' → down (1,0) 'D' → its down is out of bounds, up is visited,
  right (1,1) 'R' → dead end, 'B' → back at (1,0), 'B' → back at (0,0),
  right (0,1) 'R' → down (1,1) already visited → 'B' → 'B'
  signature "SDRBBRBB" — and the square at rows 2-3, cols 3-4 produces exactly
  the same string, so the Set keeps one.
```

Time:  O(M*N) — each cell visited once
Space: O(M*N) for the recursion stack and the signature set
