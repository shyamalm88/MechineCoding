# Coin Change II (LeetCode #518)

> Coin Change II (LeetCode #518)

## Category

🟢 IMPORTANT (Unbounded Knapsack / Counting DP)

You are given:
- an integer amount
- an array of coins (each coin can be used UNLIMITED times)

Return the number of COMBINATIONS that make up the amount.

Important:
- Order of coins does NOT matter
```text
  (1+2 and 2+1 are the SAME combination)
```

Example 1:

```text
  amount = 5
  coins = [1,2,5]
```

```text
  Combinations:
    5
    2 + 2 + 1
    2 + 1 + 1 + 1
    1 + 1 + 1 + 1 + 1
```

```text
  Output: 4
```

Example 2:

```text
  amount = 3
  coins = [2]
```

```text
  Output: 0
```

Constraints:
- 0 <= amount <= 5000
- 1 <= coins.length <= 300

## Intuition

Why This Is NOT Coin Change I

Coin Change I asks:
```text
  → minimum number of coins
```

Coin Change II asks:
```text
  → number of ways (COUNTING)
```

Key Insight (VERY IMPORTANT):

```text
  We are counting COMBINATIONS, not permutations.
```

That means:
```text
  - [1,2] and [2,1] must NOT be counted separately
```

This single requirement changes EVERYTHING about the DP.

DP STATE DEFINITION

Let:
```text
  dp[x] = number of ways to make amount x
```

Our goal:
```text
  dp[amount]
```

Base Case:
```text
  dp[0] = 1
```

Why?
- There is exactly ONE way to make amount 0:
```text
  → choose nothing
```

DP TRANSITION (CORE IDEA)

For each coin:
```text
  for all amounts >= coin:
    dp[x] += dp[x - coin]
```

Interpretation:
- To form amount x using coin c:
```text
    → append coin c to every way of forming (x - c)
```

THE MOST IMPORTANT DETAIL (INTERVIEW TRAP)

ORDER OF LOOPS MATTERS.

Correct:
```text
  for coin in coins:
    for x from coin → amount
```

Incorrect:
```text
  for x from 0 → amount:
    for coin in coins
```

Why?

- Coin-first loop ensures each combination is counted ONCE
- Amount-first loop counts permutations (WRONG)

This is the #1 mistake candidates make.

MENTAL MODEL

Think like this:

```text
  “I am deciding how many times I use coin 1,
   then coin 2,
   then coin 5…”
```

Once I move past a coin,
I NEVER go back to smaller coins.

That guarantees uniqueness.

ALGORITHM

1. Initialize dp array of size amount + 1
2. dp[0] = 1
3. For each coin:
```text
     for x = coin → amount:
        dp[x] += dp[x - coin]
```

4. Return dp[amount]

TIME & SPACE COMPLEXITY

Let:
- N = number of coins
- A = amount

Time:  O(N × A)
Space: O(A)

WHY THIS PROBLEM IS 🟢 IMPORTANT

Interviewers are testing:
- Do you understand combinations vs permutations?
- Do you know WHY loop order matters?
- Can you explain dp[0] = 1 properly?

This problem is a FOUNDATION for many DP variants.
