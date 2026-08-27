# Edit Distance (LeetCode #72)

## Category

🔴 VVIMP (2D DP with Multiple Choices)

You are given two strings:
- word1
- word2

You can perform the following operations on word1:
1) Insert a character
2) Delete a character
3) Replace a character

Each operation costs 1.

Return the MINIMUM number of operations required to
convert word1 into word2.

Example 1:

```text
  word1 = "horse"
  word2 = "ros"
```

```text
  Operations:
    horse → rorse (replace 'h' with 'r')
    rorse → rose  (delete 'r')
    rose  → ros   (delete 'e')
```

```text
  Output: 3
```

Example 2:

```text
  word1 = "intention"
  word2 = "execution"
```

```text
  Output: 5
```

Constraints:
- 0 <= word1.length, word2.length <= 500

## Intuition

What Are We REALLY Deciding?

At each step, we are aligning prefixes of the two strings.

Key Insight (CRITICAL):

```text
  Edit Distance is about:
  “What is the minimum cost to transform
   the FIRST i characters of word1
   into the FIRST j characters of word2?”
```

Once you understand this sentence,
the DP becomes obvious.

DP STATE DEFINITION

Let:
```text
  dp[i][j] = minimum operations to convert
             word1[0..i-1] → word2[0..j-1]
```

Note:
- i characters from word1
- j characters from word2

Goal:
```text
  dp[m][n]
```

BASE CASES

dp[0][j] = j
```text
  - convert empty string → j chars (j inserts)
```

dp[i][0] = i
```text
  - convert i chars → empty string (i deletes)
```

These base cases are NOT arbitrary —
they encode the meaning of dp[i][j].

DP TRANSITION (THE HEART OF THE PROBLEM)

Consider the LAST characters:
```text
  word1[i-1], word2[j-1]
```

Case 1: Characters match
```text
  word1[i-1] === word2[j-1]
```

```text
  → No operation needed
  dp[i][j] = dp[i-1][j-1]
```

Case 2: Characters do NOT match

```text
  We have THREE choices:
```

```text
  1️⃣ Insert
      Insert word2[j-1] into word1
      → dp[i][j-1] + 1
```

```text
  2️⃣ Delete
      Delete word1[i-1]
      → dp[i-1][j] + 1
```

```text
  3️⃣ Replace
      Replace word1[i-1] with word2[j-1]
      → dp[i-1][j-1] + 1
```

```text
  dp[i][j] = min(all three)
```

MENTAL MODEL (VERY IMPORTANT)

Think in terms of alignment:

```text
  word1:  h o r s e
  word2:    r o s
```

You’re deciding how prefixes align,
not individual characters in isolation.

ORDER OF COMPUTATION

dp[i][j] depends on:
- dp[i-1][j]
- dp[i][j-1]
- dp[i-1][j-1]

So:
- Fill row by row
- Left to right

ALGORITHM

1. Create dp table of size (m+1) × (n+1)
2. Initialize base cases
3. Fill table using transition rules
4. Return dp[m][n]

TIME & SPACE COMPLEXITY

Let:
- m = word1.length
- n = word2.length

Time:  O(m × n)
Space: O(m × n)

WHY THIS PROBLEM IS 🔴 VVIMP

Interviewers are testing:
- Can you define DP state precisely?
- Can you model multiple competing choices?
- Can you explain WHY the transitions make sense?

Edit Distance is a GOLD STANDARD DP problem.
