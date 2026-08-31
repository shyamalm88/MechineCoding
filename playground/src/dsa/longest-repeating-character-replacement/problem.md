# Longest Repeating Character Replacement (LeetCode #424)

You are given a string s and an integer k. You can choose any character of
the string and change it to any other uppercase English character.
You can perform this operation at most k times.

Return the length of the longest substring containing the same letter you
can get after performing the above operations.

Example 1:
Input: s = "ABAB", k = 2
Output: 4
Explanation: Replace the two 'A's with two 'B's or vice versa.

Example 2:
Input: s = "AABABBA", k = 1
Output: 4
Explanation: Replace the one 'A' in the middle with 'B' and form "AABBBBA".
The substring "BBBB" has the longest repeating letters, which is 4.

Constraints:
- 1 <= s.length <= 10^5
- s consists of only uppercase English letters.

## Approach

Sliding Window (Frequency Count)

## Intuition

In any window [left, right], we want to make all characters match the
"most frequent character" in that window.
The number of replacements needed = (Window Length) - (Count of Most Frequent Char).

If (Length - MaxFreq) <= k, the window is valid.
If (Length - MaxFreq) > k, the window is invalid, so we shrink from left.

## Dry run

Input: s = "AABABBA", k = 1

1. r=0 ('A'): freq={A:1}, maxFreq=1. Len=1. 1-1 <= 1. OK. maxLen=1.
2. r=1 ('A'): freq={A:2}, maxFreq=2. Len=2. 2-2 <= 1. OK. maxLen=2.
3. r=2 ('B'): freq={A:2, B:1}, maxFreq=2. Len=3. 3-2 <= 1. OK. maxLen=3.
4. r=3 ('A'): freq={A:3, B:1}, maxFreq=3. Len=4. 4-3 <= 1. OK. maxLen=4.

5. r=4 ('B'): freq={A:3, B:2}, maxFreq=3. Len=5. 5-3 = 2 > 1. INVALID.
```text
   - Shrink: Remove s[0] ('A'). freq={A:2, B:2}. left=1.
   - Now Len=4. 4-3 <= 1. OK.
```

6. r=5 ('B'): freq={A:2, B:3}, maxFreq=3. Len=5 (indices 1-5). 5-3 = 2 > 1. INVALID.
```text
   - Shrink: Remove s[1] ('A'). freq={A:1, B:3}. left=2.
   - Now Len=4. 4-3 <= 1. OK.
```

Result: 4

Time Complexity: O(N)
Space Complexity: O(26) -> O(1)
