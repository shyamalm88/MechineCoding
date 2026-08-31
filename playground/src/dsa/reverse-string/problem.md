# Reverse String (LeetCode #344)

Reverse an array of characters IN PLACE with O(1) extra memory.

## Intuition

The canonical converging two-pointer: swap the ends and walk inwards. The
loop stops when the pointers meet, so a middle element in an odd-length array
is correctly left alone.

The in-place constraint is the whole point — `arr.reverse()` or building a
new array defeats the exercise.

## Complexity

TIME: O(n) · SPACE: O(1)
