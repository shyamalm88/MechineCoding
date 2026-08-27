# Remove Nth Node From End of List (LeetCode #19)

Remove the nth node from the end and return the head — in one pass.

## Intuition

Two pointers separated by a GAP of n. Advance fast by n first, then move
both together; when fast hits the end, slow is exactly n from the end.

The dummy head is what makes removing the FIRST node need no special case —
without it, deleting head requires a separate branch.

## Dry run

1 2 3 4 5, n = 2
```text
  fast advances 2 → at 3
  move both until fast.next null → slow at 3, fast at 5
  slow.next = slow.next.next → removes 4
  result 1 2 3 5
```

## Time

O(n) one pass · SPACE: O(1)
