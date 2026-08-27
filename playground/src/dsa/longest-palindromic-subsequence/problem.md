# Longest Palindromic Subsequence (LeetCode #516)

## Category

🔴 VVIMP (Subsequence DP on Strings)

You are given a string s.

Return the LENGTH of the LONGEST palindromic SUBSEQUENCE in s.

## Note

- Subsequence does NOT need to be contiguous
- Characters must remain in order

Example:

```text
  s = "bbbab"
```

```text
  Longest Palindromic Subsequence:
    "bbbb"
```

```text
  Output: 4
```

Constraints:
- 1 <= s.length <= 1000

## Intuition

Substring vs Subsequence (CRITICAL)

Substring:
```text
  - contiguous
  - window expansion works
```

Subsequence:
```text
  - gaps allowed
  - window expansion FAILS
```

Key Insight (VERY IMPORTANT):

```text
  When characters at both ends match,
  we WANT to include them.
```

```text
  When they don’t,
  we must SKIP something.
```

DP STATE DEFINITION

Let:
```text
  dp[i][j] = length of the longest palindromic subsequence
             in s[i..j]
```

Goal:
```text
  dp[0][n-1]
```

BASE CASES

i === j:
```text
  dp[i][j] = 1   (single character)
```

i > j:
```text
  dp[i][j] = 0   (empty substring)
```

DP TRANSITION

If s[i] === s[j]:

```text
  dp[i][j] = 2 + dp[i+1][j-1]
```

Else:

```text
  dp[i][j] = max(
    dp[i+1][j],   // skip left
    dp[i][j-1]    // skip right
  )
```

Interpretation:
- When ends match → take both
- When ends don’t → best of skipping one side

ORDER OF COMPUTATION (CRITICAL)

dp[i][j] depends on:
- dp[i+1][j]
- dp[i][j-1]
- dp[i+1][j-1]

Therefore:
- Compute shorter substrings FIRST

Correct order:
- i from n-1 → 0
- j from i+1 → n-1

MENTAL MODEL

Think like:

```text
  “For substring s[i..j],
   what is the best palindrome I can build?”
```

If ends match → great.
If not → drop one end.

ALGORITHM

1. Create dp[n][n]
2. Initialize dp[i][i] = 1
3. Fill table using correct order
4. Return dp[0][n-1]

TIME & SPACE COMPLEXITY

Time:  O(n²)
Space: O(n²)

WHY THIS PROBLEM IS 🔴 VVIMP

Interviewers are testing:
- Do you understand subsequence DP?
- Can you explain why skipping works?
- Do you respect DP dependency order?

This problem is a DP CLASSIC.
