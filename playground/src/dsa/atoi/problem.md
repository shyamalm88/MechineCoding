# String to Integer (atoi) (LeetCode #8)

> String to Integer (atoi) (LeetCode #8)

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
