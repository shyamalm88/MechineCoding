# Design Circular Deque (LeetCode #641)

> Design Circular Deque (LeetCode #641)

## Intuition

A fixed-size array used as a RING: instead of shifting elements (O(n)), move
the front/rear indices and wrap with modulo. Every operation becomes O(1).

The classic ambiguity is that front === rear means both "empty" and "full".
Two standard fixes: keep an explicit size counter (used here — simplest), or
waste one slot. Say which you chose.

Note the modulo when moving front backwards: `(front - 1 + capacity) %
capacity`, because JavaScript's % returns negatives for negative operands.

## Time

O(1) all operations   SPACE: O(k)
