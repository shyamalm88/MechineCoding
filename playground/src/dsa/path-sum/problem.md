# Path Sum (LeetCode #112)

Is there a root-to-LEAF path whose values sum to targetSum?

## Intuition

Subtract as you descend: ask each child whether it can make up the remainder.
The base case is what people get wrong — you must land on an actual LEAF
(no children), not merely reach null.

```text
  if (!root) return false        ← null is not a leaf
  if (leaf) return remaining === root.val
```

Returning true at null would accept a single-child node whose one branch is
missing, which is not a root-to-leaf path.

Negative values are allowed, so you cannot prune early when the remainder
goes below zero.

## Time

O(n) · SPACE: O(h) recursion depth
