# Reveal Cards In Increasing Order (LeetCode #950)

> Reveal Cards In Increasing Order (LeetCode #950)

Order a deck so that repeatedly (reveal top, move next card to the bottom)
yields increasing order.

## Intuition

Simulating forwards requires guessing the arrangement. Run the process
BACKWARDS instead and it becomes deterministic:

```text
  place cards from largest to smallest; before each placement, move the
  current bottom card to the top (the inverse of "move top to bottom").
```

Reversing an unknown-input process to make it constructive is the
transferable idea here.

## Dry run

sorted [2,3,5,7,11,13,17]
```text
  start [17]; rotate+push 13 → [13,17]; rotate+push 11 → [11,17,13] ...
  final [2,13,3,11,5,17,7]
```

## Time

O(n log n) for the sort   SPACE: O(n)
