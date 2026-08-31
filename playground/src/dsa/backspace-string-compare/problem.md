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

## Approach

Two Pointers from the END (O(1) space)

## Story / intuition

Process both strings from RIGHT to LEFT simultaneously.
Backspaces only affect characters to their LEFT — so scan right-to-left.
Track pending backspace count. Skip characters when there's a pending backspace.
Compare the first "valid" (non-skipped) character from each string.

## Algorithm

Two pointers i (for s), j (for t).
Use getNext(str, idx) → returns the index of next valid character (skipping backspaces).
Compare s[i] == t[j]. If equal, both advance. If either is -1 (exhausted), must match.

## Dry run

s="ab#c", t="ad#c"
i=3(c), j=3(c): both valid. s[3]=c==t[3]=c ✓. i=2, j=2.
i=2('#'): skip. i=1. i=1('b'): skip (backspace from #). i=0.
j=2('#'): skip. j=1. j=1('d'): skip. j=0.
i=0('a'), j=0('a'): a==a ✓. i=-1, j=-1.
Both exhausted at same time → true ✓

Time:  O(M + N)
Space: O(1)
