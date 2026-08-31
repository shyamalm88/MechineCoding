# Valid Parenthesis String (LeetCode #678)

Given a string s containing only three types of characters: '(', ')' and '*',
return true if s is valid.

The following rules define a valid string:
1. Any left parenthesis '(' must have a corresponding right parenthesis ')'.
2. Any right parenthesis ')' must have a corresponding left parenthesis '('.
3. Left parenthesis '(' must go before the corresponding right parenthesis ')'.
4. '*' could be treated as a single right parenthesis ')', a single left
```text
   parenthesis '(', or an empty string "".
```

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "(*)"
Output: true

Example 3:
Input: s = "(*))"
Output: true

Constraints:
- 1 <= s.length <= 100
- s[i] is '(', ')' or '*'.

## Approach

Greedy (Range of Open Counts)

## Intuition

Since '*' is flexible, at any point in the string, we don't have a single
count of open parentheses. Instead, we have a range of possible open
parenthesis counts: [minOpen, maxOpen].

- minOpen: The minimum number of open parentheses we MUST have (treating '*' as ')').
- maxOpen: The maximum number of open parentheses we COULD have (treating '*' as '(').

Iteration logic:
- '(': Increment both minOpen and maxOpen.
- ')': Decrement both minOpen and maxOpen.
- '*': Decrement minOpen (treat as ')') and increment maxOpen (treat as '(').

Validity checks during iteration:
1. If maxOpen < 0: We have too many ')' even if we turned every '*' into '('. Invalid.
2. If minOpen < 0: We treated too many '*' as ')'. Since '*' can be empty, we reset minOpen to 0.

Final check:
- If minOpen == 0, it means it's possible to close all parentheses.

Time Complexity: O(N)
Space Complexity: O(1)
