# Reverse Linked List (LeetCode #206)

Reverse a singly linked list and return the new head.

## Intuition

Walk the list re-pointing each node's `next` at the node behind it. Three
pointers are the whole trick: `prev` (already reversed), `curr` (the node
being moved) and a saved `next` — because overwriting curr.next destroys
the only reference to the rest of the list.

## Dry run

1 → 2 → 3
```text
  prev=null curr=1 : save 2, 1.next=null, prev=1, curr=2
  prev=1    curr=2 : save 3, 2.next=1,    prev=2, curr=3
  prev=2    curr=3 : save null, 3.next=2, prev=3, curr=null
  return prev = 3 → 2 → 1
```

## Complexity

TIME: O(n) · SPACE: O(1) iterative, O(n) recursive (call stack)
