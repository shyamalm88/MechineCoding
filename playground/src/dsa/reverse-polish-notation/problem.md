# Evaluate Reverse Polish Notation (LeetCode #150)

Evaluate the value of an arithmetic expression in Reverse Polish Notation.
Valid operators are +, -, *, and /. Each operand may be an integer or another expression.
Note that division between two integers should truncate toward zero.

Example 1:
Input: tokens = ["2","1","+","3","*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9

Example 2:
Input: tokens = ["4","13","5","/","+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6

## Approach

Stack

## Intuition

Iterate through the tokens. If the token is a number, push it onto the stack.
If the token is an operator, pop the top two numbers from the stack, perform
the operation, and push the result back.

Note on order: When popping, the first number is the right operand, and the
second number is the left operand.

Time Complexity: O(N)
Space Complexity: O(N)
