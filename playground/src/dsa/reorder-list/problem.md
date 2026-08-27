# Reorder List (LeetCode #143)

> Reorder List (LeetCode #143)

Reorder 1→2→3→4→5 into 1→5→2→4→3, in place.

## Intuition

The target interleaves the list with its own reverse. Three known steps:
```text
  1. split at the middle
  2. reverse the second half
  3. weave the two halves alternately
```

This problem is really a test of whether you can COMPOSE the primitives
rather than invent something new.

## Dry run

1 2 3 4
```text
  halves: [1,2] and [3,4] → reverse second → [4,3]
  weave: 1 → 4 → 2 → 3
```

## Time

O(n)   SPACE: O(1)
