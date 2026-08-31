# Valid Parentheses (LeetCode #20)

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

## Approach

Stack

## Intuition

Use a stack to keep track of opening brackets. When a closing bracket is encountered,
check if it matches the most recent opening bracket (top of stack).

Time Complexity: O(N)
Space Complexity: O(N)
