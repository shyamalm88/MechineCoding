# Linked List Cycle (LeetCode #141)

Does the list contain a cycle?

## Intuition

Floyd's tortoise and hare. Move slow one step and fast two. In a cycle the
gap between them closes by exactly one each iteration, so they must
eventually collide. With no cycle, fast runs off the end.

A Set of visited nodes also works in O(n) space -- state the trade, then give
the O(1) answer.

## Dry run

3 → 2 → 0 → -4 → (back to 2)
```text
  slow 2, fast 0 → slow 0, fast 2 → slow -4, fast -4 → collision → true
```

## Complexity

TIME: O(n) · SPACE: O(1)

FOLLOW-UP (#142, cycle start): after the collision, reset one pointer to the
head and advance both one step at a time; they meet at the cycle entrance.
