# Distinct Subsequences (LeetCode #115)

You are given two strings:
- s (source string)
- t (target string)

Return the number of DISTINCT subsequences of s
which equal t.

Example 1:

```text
  s = "rabbbit"
  t = "rabbit"
```

```text
  Output: 3
```

```text
  Explanation:
  The three ways are:
    r a b b b i t
    r a b b b i t
    r a b b b i t
       ^ ^   ^
```

Example 2:

```text
  s = "babgbag"
  t = "bag"
```

```text
  Output: 5
```

Constraints:
- 1 <= s.length, t.length <= 1000

## Intuition

What Are We REALLY Counting?

We are NOT finding substrings.
We are counting subsequences.

Key Insight (CRITICAL):

```text
  Every character in s gives us a CHOICE:
    - use it
    - or skip it
```

But:
```text
  - We must preserve order
  - We must match ALL characters of t
```

This is a PREFIX-ALIGNMENT problem.

DP STATE DEFINITION

Let:
```text
  dp[i][j] = number of ways
             to form t[0..j-1]
             from s[0..i-1]
```

Meaning:
- Use first i chars of s
- To form first j chars of t

Goal:
```text
  dp[m][n]
```

BASE CASES (VERY IMPORTANT)

dp[i][0] = 1   for all i

Why?
- There is EXACTLY ONE way to form empty string t:
```text
  → choose nothing
```

dp[0][j] = 0   for j > 0

Why?
- You cannot form non-empty t from empty s

DP TRANSITION (THE HEART OF THE PROBLEM)

Consider:
```text
  s[i-1] and t[j-1]
```

Case 1: s[i-1] === t[j-1]

```text
  We have TWO choices:
```

```text
  1️⃣ Use this character:
      dp[i-1][j-1]
```

```text
  2️⃣ Skip this character:
      dp[i-1][j]
```

```text
  dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
```

Case 2: s[i-1] !== t[j-1]

```text
  We CANNOT use this character.
```

```text
  dp[i][j] = dp[i-1][j]
```

MENTAL MODEL

Think like this:

```text
  “At position i in s,
   how many ways can I complete t?”
```

If characters match → branching.
If not → forced skip.

ORDER OF COMPUTATION

dp[i][j] depends on:
- dp[i-1][j]
- dp[i-1][j-1]

So:
- Compute row by row
- Left to right

ALGORITHM

1. Create dp table of size (m+1) × (n+1)
2. Initialize base cases
3. Fill dp table using transitions
4. Return dp[m][n]

TIME & SPACE COMPLEXITY

Let:
- m = s.length
- n = t.length

Time:  O(m × n)
Space: O(m × n)

WHY THIS PROBLEM IS 🔴 VVIMP

Interviewers are testing:
- Can you count without duplicates?
- Do you understand prefix DP?
- Can you explain branching clearly?

This problem appears in MANY disguised forms.
