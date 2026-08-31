# Minimum Window Substring (LeetCode #76)

Given two strings s and t of lengths m and n respectively, return the minimum
window substring of s such that every character in t (including duplicates)
is included in the window. If there is no such substring, return the empty string "".

Example 1:
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.

Example 2:
Input: s = "a", t = "a"
Output: "a"

Constraints:
- m == s.length, n == t.length
- 1 <= m, n <= 10^5

## Approach

Sliding Window (Expand & Shrink)

## Intuition

1. We use two frequency maps: `need` (for t) and `window` (for current window in s).
2. We track `formed`: the number of *unique* characters in `t` that are fully satisfied in the current window.
```text
   - `required` is the total number of unique characters in `t`.
```

3. Expand `right` to add characters. If a character's frequency in `window` matches `need`, increment `formed`.
4. Once `formed === required` (window is valid), shrink `left` to minimize size.
```text
   - If removing a character causes its frequency to drop below `need`, decrement `formed`.
```

## Dry run

Input: s = "ADOBECODEBANC", t = "ABC"
need = {A:1, B:1, C:1}, required = 3

1. Expand right until valid:
```text
   - r=0 ('A'): window={A:1}. Matches need. formed=1.
   - ...
   - r=5 ('C'): window={..., C:1}. Matches need. formed=2.
   - ...
   - r=9 ('B'): window={..., B:1}. Matches need. formed=3.
   - Window: "ADOBECODEB" (indices 0-9). Valid.
```

2. Shrink left while valid (formed === 3):
```text
   - l=0 ('A'): Remove 'A'. window={A:0}. formed becomes 2.
   - Record minLen=10 ("ADOBECODEB").
   - Move l to 1. Window invalid.
```

3. Continue Expand & Shrink:
```text
   - r=10 ('A'): window={A:1}. formed=3. Valid. Shrink l=1..5. Record minLen=6 ("CODEBA").
   - r=12 ('C'): window={C:1}. formed=3. Valid. Shrink l=... Record minLen=4 ("BANC").
```

Result: "BANC"

Time Complexity: O(S + T) - Each char in s is added and removed at most once.
Space Complexity: O(1) - Map size is bounded by alphabet size (e.g., 128 ASCII).
