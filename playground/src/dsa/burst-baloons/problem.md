# Burst Balloons (LeetCode #312)

> Burst Balloons (LeetCode #312)

## Category

🔴 VVIMP (Interval DP / Reverse Thinking)

You are given n balloons, each with a number.

When you burst a balloon at index i, you gain:

```text
  nums[i - 1] * nums[i] * nums[i + 1]
```

After bursting:
- Balloon i disappears
- Neighbors become adjacent

You may burst balloons in ANY order.

Return the MAXIMUM coins you can collect.

Example:

```text
  nums = [3,1,5,8]
```

```text
  One optimal order:
    burst 1 → gain 3*1*5 = 15
    burst 5 → gain 3*5*8 = 120
    burst 3 → gain 1*3*8 = 24
    burst 8 → gain 1*8*1 = 8
```

```text
  Total = 167
```

Constraints:
- 1 <= nums.length <= 300

## Intuition

Why Greedy / Forward DP Fails

Forward thinking:
```text
  “Which balloon should I burst FIRST?”
```

❌ Wrong.

Because:
- Bursting a balloon changes neighbors
- Early decisions affect later rewards unpredictably

Key Insight (CRITICAL):

```text
  Instead of thinking about the FIRST balloon,
  think about the LAST balloon to burst.
```

THE REVERSE THINKING TRICK (THE KEY)

Suppose:
- In interval (i, j)
- Balloon k is the LAST one to burst

At that moment:
- All balloons between (i, j) except k are gone
- So k’s neighbors are exactly i and j

Coins gained:
```text
  nums[i] * nums[k] * nums[j]
```

## Plus

- Best coins from (i, k)
- Best coins from (k, j)

This creates a clean subproblem.

DP STATE DEFINITION

First, pad nums:
```text
  nums = [1, ...nums, 1]
```

Let:
```text
  dp[i][j] = maximum coins obtained
             by bursting balloons strictly between i and j
```

Note:
- i and j are NOT burst
- We burst balloons in (i, j)

Goal:
```text
  dp[0][n+1]
```

DP TRANSITION (THE HEART OF THE PROBLEM)

For interval (i, j):

```text
  dp[i][j] =
    max over k in (i, j):
      dp[i][k]
    + nums[i] * nums[k] * nums[j]
    + dp[k][j]
```

k is the LAST balloon to burst in this interval.

BASE CASE

If j === i + 1:
```text
  dp[i][j] = 0
```

(No balloons to burst)

ORDER OF COMPUTATION (CRITICAL)

dp[i][j] depends on:
- smaller intervals

So:
- iterate by interval length
- from small → large

MENTAL MODEL

Think like this:

```text
  “For a fixed boundary (i, j),
   which balloon k do I want to burst LAST?”
```

Reverse thinking simplifies everything.

ALGORITHM

1. Pad nums with 1 at both ends
2. Initialize dp[][] = 0
3. For len from 2 → n:
```text
     for i:
       j = i + len
       try all k in (i, j)
```

4. Return dp[0][n+1]

TIME & SPACE COMPLEXITY

Let:
- n = original nums length

Time:  O(n³)
Space: O(n²)

WHY THIS PROBLEM IS 🔴 VVIMP

Interviewers are testing:
- Can you reverse the problem?
- Can you do interval DP?
- Do you understand dependency ordering?

If you can explain this clearly,
you are DP-strong.
