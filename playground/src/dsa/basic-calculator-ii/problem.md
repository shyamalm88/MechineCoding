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

## Approach

Stack + "resolve on sight" for * and /

## Story / intuition

Without parentheses, the only thing that changes the ORDER of evaluation
is operator precedence: '*' and '/' bind tighter than '+' and '-'.

Trick: process the string left to right, building up each number digit by
digit. As soon as we hit the NEXT operator (or the end of the string), we
know the FULL number we just finished reading, and we know what to do with
it based on the PREVIOUS operator (`sign`):

- prev sign '+' → push  num   onto the stack
- prev sign '-' → push -num   onto the stack
- prev sign '*' → pop the last value, push (last * num)
- prev sign '/' → pop the last value, push trunc(last / num)

'*' and '/' are resolved IMMEDIATELY against the value already on top of
the stack — that's how precedence is enforced without a separate pass.
'+' and '-' just get queued onto the stack as signed values; at the end we
sum everything left in the stack.

## Dry run

s = "3+2*2"
sign starts as '+', num=0

i=0 '3': num=3
i=1 '+': finish num=3, sign was '+' → push 3        → stack=[3]
```text
         sign='+', num=0
```

i=2 '2': num=2
i=3 '*': finish num=2, sign was '+' → push 2        → stack=[3,2]
```text
         sign='*', num=0
```

i=4 '2' (last char): finish num=2, sign was '*'
```text
         → pop 2, push 2*2=4                         → stack=[3,4]
```

sum(stack) = 3 + 4 = 7 ✓

Time:  O(N) — single pass
Space: O(N) — stack holds at most one entry per '+'/'-' term
