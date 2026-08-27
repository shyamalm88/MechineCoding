# Backspace String Compare (LeetCode #844)

Given two strings s and t, where '#' represents a backspace character,
return true if they are equal after processing all backspaces.

Example 1:
Input: s="ab#c", t="ad#c" → Output: true  ("ac" == "ac")

Example 2:
Input: s="ab##", t="c#d#" → Output: true  ("" == "")

Example 3:
Input: s="a#c", t="b"     → Output: false ("c" != "b")

Constraints:
- 1 <= s.length, t.length <= 200
- s and t only contain lowercase letters and '#'
- Follow-up: solve in O(1) space
