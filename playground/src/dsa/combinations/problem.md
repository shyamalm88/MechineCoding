# Combinations (LeetCode #77)

## Category

🔵 CORE (Backtracking Fundamentals)

Given two integers n and k,
return all possible combinations of k numbers
chosen from the range [1, n].

Order does NOT matter.

Example:

```text
  n = 4, k = 2
```

```text
  Output:
  [
    [1,2],
    [1,3],
    [1,4],
    [2,3],
    [2,4],
    [3,4]
  ]
```

INTUITION

This is the PUREST backtracking problem.

At each step:
- Decide whether to INCLUDE a number
- Move forward so we never reuse numbers

Key Insight:
- Order doesn't matter → we must avoid revisiting smaller numbers

BACKTRACKING STATE

State:
- path   → current combination
- start  → next number we are allowed to use

Goal:
- path.length === k

DECISION TREE

For each number i from start → n:
```text
  - choose i
  - recurse with start = i + 1
  - undo (backtrack)
```

TIME COMPLEXITY

O(C(n, k))

WHY THIS IS 🔵 CORE

This defines the TEMPLATE for:
- subsets
- permutations
- combinationSum

If this is shaky, everything else breaks.
