# Basic Calculator II (LeetCode #227)

Given a string `s` representing a non-negative integer arithmetic
expression, evaluate it and return the result. The expression contains
only non-negative integers, '+', '-', '*', '/' operators, and empty
spaces. The integer division should truncate toward zero.

There are NO parentheses in the expression.

Example 1:
Input: s = "3+2*2"
Output: 7

Example 2:
Input: s = " 3/2 "
Output: 1

Example 3:
Input: s = " 3+5 / 2 "
Output: 5

Constraints:
- 1 <= s.length <= 3 * 10^5
- s consists of integers and operators ('+','-','*','/') separated by
```text
  some number of spaces.
```

- s represents a valid expression.
- All intermediate results will be in the range [-2^31, 2^31 - 1].
