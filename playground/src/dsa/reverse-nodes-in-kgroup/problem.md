# Reverse Nodes in k-Group (LeetCode #25)

Reverse every consecutive group of k nodes. A trailing group with fewer than
k nodes is left as-is.

## Intuition

Reversing k nodes is the standard 3-pointer reverse. The hard part is the
BOOKKEEPING between groups: after reversing a group, the node that was its
head is now its tail and must be linked to whatever comes next.

The dummy node plus a `groupPrev` pointer makes that manageable:
```text
  groupPrev → [ ...k nodes reversed... ] → rest
```

Crucially you must FIRST check that k nodes remain — otherwise you reverse a
partial tail and violate the spec.

## Dry run

1 2 3 4 5, k = 2
```text
  group [1,2] → 2 1, groupPrev now 1
  group [3,4] → 4 3, groupPrev now 3
  only [5] left → untouched
  result 2 1 4 3 5
```

## Time

O(n) · SPACE: O(1)
