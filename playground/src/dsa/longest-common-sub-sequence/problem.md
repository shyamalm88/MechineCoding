# Longest Common Subsequence (LeetCode #1143)

Given two strings text1 and text2, return the length of their longest
common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string
with some characters (can be none) deleted without changing the relative order
of the remaining characters.

Example 1:
Input: text1 = "abcde", text2 = "ace"
Output: 3
Explanation: The longest common subsequence is "ace" and its length is 3.

Example 2:
Input: text1 = "abc", text2 = "def"
Output: 0

Constraints:
- 1 <= text1.length, text2.length <= 1000
- text1 and text2 consist of only lowercase English characters.

## Approach

2D Dynamic Programming

## Intuition

We compare text1[i] and text2[j].
- If characters match: The LCS length increases by 1 plus whatever the LCS was
```text
  without these characters (diagonal: dp[i-1][j-1]).
```

- If they don't match: We can't include both. We take the best result from
```text
  either ignoring the character from text1 (up: dp[i-1][j]) or ignoring the
  character from text2 (left: dp[i][j-1]).
```

Time Complexity: O(M * N)
Space Complexity: O(M * N)
