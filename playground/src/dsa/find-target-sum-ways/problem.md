# Target Sum (LeetCode #494)

You are given an array of integers nums and an integer target.

You can assign either:
```text
  '+' or '-'
```

in front of each number.

Return the number of DIFFERENT expressions that evaluate to target.

Example 1:

```text
  nums = [1,1,1,1,1]
  target = 3
```

```text
  Expressions:
    +1 +1 +1 +1 -1
    +1 +1 +1 -1 +1
    +1 +1 -1 +1 +1
    +1 -1 +1 +1 +1
    -1 +1 +1 +1 +1
```

```text
  Output: 5
```

Constraints:
- 1 <= nums.length <= 20
- 0 <= nums[i] <= 1000

## Intuition

Why Signs Are Misleading

At first glance, this looks like:
```text
  “Try all + / - combinations”
```

That’s exponential brute force.

Key Insight (CRITICAL):

```text
  The signs partition numbers into TWO groups:
    - P (positive)
    - N (negative)
```

Let:
```text
  sum(P) - sum(N) = target
```

Also:
```text
  sum(P) + sum(N) = totalSum
```

PROBLEM TRANSFORMATION (THE KEY STEP)

Add both equations:

```text
  2 × sum(P) = target + totalSum
```

So:

```text
  sum(P) = (target + totalSum) / 2
```

This transforms the problem into:

```text
  “How many subsets have sum = sum(P)?”
```

Which is a CLASSIC 0/1 KNAPSACK COUNTING problem.

SANITY CHECKS (IMPORTANT)

If:
- target + totalSum < 0
- (target + totalSum) is odd

→ return 0

DP STATE DEFINITION

Let:
```text
  dp[s] = number of ways to form sum s
```

Goal:
```text
  dp[sum(P)]
```

DP TRANSITION

For each number num:
```text
  for s from targetSum → num:
    dp[s] += dp[s - num]
```

This ensures:
- Each number used at most once
- Counting combinations correctly

BASE CASE

dp[0] = 1

Meaning:
- There is exactly one way to form sum 0:
```text
  choose nothing
```

MENTAL MODEL

You are NOT choosing signs.
You are choosing WHICH numbers go into the positive group.

ALGORITHM

1. Compute totalSum
2. Compute requiredSum = (target + totalSum) / 2
3. Validate requiredSum
4. Run 0/1 knapsack count DP
5. Return dp[requiredSum]

TIME & SPACE COMPLEXITY

Let:
- N = nums.length
- S = requiredSum

Time:  O(N × S)
Space: O(S)

WHY THIS PROBLEM IS 🔴 VVIMP

Interviewers are testing:
- Can you transform problems mathematically?
- Can you reduce exponential brute force to DP?
- Do you recognize knapsack patterns?

This is a SIGNATURE Google DP problem.
