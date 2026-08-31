# Palindrome Linked List (LeetCode #234)

Determine whether a singly linked list reads the same forwards and backwards,
in O(1) extra space.

## Intuition

Copying values into an array and two-pointering it is O(n) space and usually
rejected. The O(1) answer composes two primitives you already know:
```text
  1. find the middle (fast/slow)
  2. reverse the second half
  3. walk both halves in lockstep comparing values
```

## Dry run

1 2 2 1
```text
  middle → second half starts at index 2
  reverse second half → 1 2
  compare 1==1, 2==2 → true
```

## Complexity

TIME: O(n) · SPACE: O(1)

## Important

this MUTATES the input. Interviewers often ask you to restore it —
re-reverse the second half before returning.
