# Longest Valid Parentheses (LeetCode #32)

Given a string containing just the characters '(' and ')', return the
length of the longest valid (well-formed) parentheses substring.

Example 1:
Input: s = "(()"
Output: 2
Explanation: The longest valid parentheses substring is "()".

Example 2:
Input: s = ")()())"
Output: 4
Explanation: The longest valid parentheses substring is "()()".

Example 3:
Input: s = ""
Output: 0

Constraints:
- 0 <= s.length <= 3 * 10^4
- s[i] is '(' or ')'.

## Approach

Stack of Indices (Track Boundary of Last Unmatched ')')

## Intuition

Push a sentinel index -1 onto the stack first - it acts as the "base"
boundary for the current valid run.

- On '(': push its index. It's a potential boundary if it never gets matched.
- On ')':
```text
  - Pop the stack (try to match it against the last '(' or boundary).
  - If the stack becomes empty, this ')' is unmatched, so push its index
    as the new boundary for future valid runs.
  - Otherwise, the top of the stack now points to the index just before
    the start of the current valid run, so the valid length is
    `i - stack[top]`.
```

Every time we compute a valid length, update `maxLen` with the max seen.

Time Complexity: O(N) - single pass, each index pushed/popped at most once.
Space Complexity: O(N) - stack can hold up to N indices in the worst case.
