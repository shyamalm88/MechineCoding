# Fibonacci Number (LeetCode #509)

## Intuition

The canonical introduction to DP, because all three stages are visible:

```text
  naive recursion  O(2^n)  -- recomputes the same subproblems exponentially
  memoised (top-down) O(n) -- cache results, recursion unchanged
  tabulated (bottom-up) O(n) time, O(1) space -- only the last two values
                                                 are ever needed
```

Recognising that only two previous values matter is the "rolling array"
space optimisation that reappears in House Robber, Climbing Stairs and
many 1D DP problems.

## Time

O(n) · SPACE: O(1) for the iterative form
