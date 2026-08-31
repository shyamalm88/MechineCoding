# Palindrome Partitioning (LeetCode #131)

Given a string s, partition s such that every substring of the partition is a
palindrome. Return all possible palindrome partitioning of s.

Example 1:
Input: s = "aab"
Output: [["a","a","b"],["aa","b"]]

Example 2:
Input: s = "a"
Output: [["a"]]

Constraints:
- 1 <= s.length <= 16
- s contains only lowercase English letters.

## Approach

Backtracking

## Intuition

We want to cut the string into pieces.
At index `start`, we can cut at `end` (where start <= end < length) IF
the substring s[start...end] is a palindrome.
If it is, we add it to our current list and recurse for the rest of the string.

Time Complexity: O(N * 2^N) - In worst case (e.g., "aaaa"), every substring is valid.
Space Complexity: O(N) - Recursion stack.
