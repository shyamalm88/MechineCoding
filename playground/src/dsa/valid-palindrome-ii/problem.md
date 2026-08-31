# Valid Palindrome II (LeetCode #680)

Given a string s, return true if the s can be palindrome after deleting at
most one character from it.

Example 1:
Input: s = "aba"
Output: true

Example 2:
Input: s = "abca"
Output: true
Explanation: You could delete the character 'c'.

Example 3:
Input: s = "abc"
Output: false

Constraints:
- 1 <= s.length <= 10^5
- s consists of lowercase English letters.

## Approach

Two Pointers (Greedy with One Skip)

## Intuition

We use standard two pointers (left, right) to check for a palindrome.
If s[left] === s[right], we continue moving inward.

If s[left] !== s[right], we have a mismatch. We are allowed ONE deletion.
We have two choices:
1. Delete character at `left` (check if substring s[left+1...right] is palindrome).
2. Delete character at `right` (check if substring s[left...right-1] is palindrome).

If either of those substrings is a valid palindrome, return true.

Time Complexity: O(N)
Space Complexity: O(1)
