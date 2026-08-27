# Middle of the Linked List (LeetCode #876)

> Middle of the Linked List (LeetCode #876)

Return the middle node. With an even count, return the SECOND middle.

## Intuition

Fast/slow pointers. Fast moves two steps for every one of slow, so when
fast reaches the end slow is exactly halfway. One pass, no length count.

## Dry run

1 2 3 4 5
```text
  slow=1 fast=1 → slow=2 fast=3 → slow=3 fast=5 → fast.next null, stop
  middle = 3
```

The loop condition decides which middle you get on even input:
```text
  while (fast && fast.next)      → SECOND middle  (this problem)
  while (fast.next && fast.next.next) → FIRST middle
```

## Time

O(n)   SPACE: O(1)
