# Basic Calculator (LeetCode #224)

Evaluate a string with +, -, non-negative integers and PARENTHESES.
(No * or / — that is #227.)

## Intuition

Parentheses only ever flip signs here, so you never need to recurse or build
a tree. Carry a running `sign` (+1/-1) and push the pending state onto a
stack when a '(' opens:

```text
  '('  → push (result, sign), then reset both for the sub-expression
  ')'  → result = result * savedSign + savedResult
```

Accumulate multi-digit numbers with `num = num * 10 + digit` — a single-digit
assumption is the usual bug.

## Dry run

"(1+(4+5))-3"
```text
  '(' push(0,+1), reset
  1 → result 1
  '(' push(1,+1), reset
  4+5 → result 9
  ')' → 9*1 + 1 = 10
  ')' → 10*1 + 0 = 10
  -3 → 7
```

## Time

O(n) · SPACE: O(n) for nesting depth
