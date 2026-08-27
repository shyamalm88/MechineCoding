# Min Cost Climbing Stairs (LeetCode #746)

cost[i] is the price of stepping off stair i. You may climb 1 or 2 steps and
may start at index 0 or 1. Find the cheapest way to reach the TOP (past the
last stair).

## Intuition

dp[i] = the minimum cost to REACH stair i (not to leave it). You arrive from
either i-1 or i-2, paying that stair's cost on the way out:

```text
  dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
```

dp[0] = dp[1] = 0 because both are free starting points. The answer is
dp[n] — the top is one past the last stair, which is the detail most people
get wrong (returning dp[n-1] instead).

Only the last two values matter, so it collapses to O(1) space.

## Dry run

[10,15,20]
```text
  dp2 = min(0+15, 0+10) = 10
  dp3 = min(10+20, 0+15) = 15  ← start at index 1, skip to top
```

## Time

O(n) · SPACE: O(1)
