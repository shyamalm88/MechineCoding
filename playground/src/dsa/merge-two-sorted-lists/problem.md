# Merge Two Sorted Lists (LeetCode #21)

Splice two sorted lists into one sorted list.

## Intuition

The classic merge step of merge sort. A DUMMY head removes every
special case for "is this the first node?" — you always append to
`tail.next` and return `dummy.next` at the end.

## Dry run

[1,2,4] and [1,3,4]
```text
  compare 1,1 → take a → 1
  compare 2,1 → take b → 1
  compare 2,3 → take a → 2
  compare 4,3 → take b → 3
  compare 4,4 → take a → 4
  a exhausted → attach rest of b → 4
  result 1 1 2 3 4 4
```

## Complexity

TIME: O(n + m) · SPACE: O(1) — nodes are relinked, not copied
