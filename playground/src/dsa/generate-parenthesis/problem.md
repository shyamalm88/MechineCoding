# Generate Parentheses (LeetCode #22)

Given n pairs of parentheses, write a function to generate all combinations
of well-formed parentheses.

Example 1:
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]

Example 2:
Input: n = 1
Output: ["()"]

Constraints:
- 1 <= n <= 8

## Approach

Backtracking

## Intuition

We build the string character by character. At any point, we can add:
1. An opening bracket '(' if we haven't used all n opening brackets.
2. A closing bracket ')' if the number of closing brackets used so far is
```text
   less than the number of opening brackets (to ensure validity).
```

Time Complexity: O(4^n / sqrt(n)) - Catalan number sequence.
Space Complexity: O(n) - Recursion stack depth.
