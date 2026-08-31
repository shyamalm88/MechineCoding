# String to Integer (atoi) (LeetCode #8)

Implement the myAtoi(string s) function, which converts a string to a
32-bit signed integer (similar to C/C++'s atoi function).

The algorithm:
1. Skip leading whitespace.
2. Read an optional '+' or '-' sign (default is positive).
3. Read digits until a non-digit character or the end of input. If no
```text
   digits were read, the result is 0.
```

4. Clamp the result to the 32-bit signed integer range
```text
   [-2^31, 2^31 - 1] = [-2147483648, 2147483647].
```

Example 1:
Input: s = "42"
Output: 42

Example 2:
Input: s = "   -42"
Output: -42

Example 3:
Input: s = "4193 with words"
Output: 4193

Example 4:
Input: s = "words and 987"
Output: 0

Example 5:
Input: s = "-91283472332"
Output: -2147483648 (clamped to INT_MIN)

Constraints:
- 0 <= s.length <= 200
- s consists of English letters, digits, ' ', '+', '-', and '.'

## Approach

Single-pass character scan with early overflow clamping

## Story / intuition

This problem isn't algorithmically hard — it's an EDGE-CASE GAUNTLET.
Walk through the string exactly like a human "reads" a number out loud:

1. Skip any leading spaces — they don't count.
2. The very next character might be a sign ('+' or '-') — grab it once.
3. From there, keep consuming DIGITS and building up the number.
```text
   The moment you hit a non-digit (a letter, '.', another space, end of
   string) — STOP. Everything after that is irrelevant.
```

4. If you never saw a digit at all, the answer is 0.

## Overflow

JS numbers don't overflow like a 32-bit int would, so we check
after EVERY digit: if the number being built already exceeds INT_MAX
(or its negation exceeds INT_MIN), clamp and return immediately —
no need to keep building an astronomically large number first.

## Dry run

s = "   -42abc"
i=0..2: spaces → skip → i=3
i=3: '-' → sign=-1, i=4
i=4: '4' → num=4
i=5: '2' → num=42
i=6: 'a' → not a digit → stop
result = -1 * 42 = -42 ✓

Time:  O(N) — single pass
Space: O(1)
