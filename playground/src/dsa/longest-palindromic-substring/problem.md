# Longest Palindromic Substring (LeetCode #5)

Given a string s, return the longest palindromic substring in s.

Example 1:
Input: s = "babad"
Output: "bab" (or "aba")

Example 2:
Input: s = "cbbd"
Output: "bb"

Constraints:
- 1 <= s.length <= 1000

## Approach

Expand Around Center

## Intuition

A palindrome mirrors around its center. Therefore, a palindrome can be
expanded from its center.
There are 2N - 1 centers (N single character centers, N-1 between-character centers).
We iterate through each possible center and expand outwards.

Time Complexity: O(N^2)
Space Complexity: O(1)
