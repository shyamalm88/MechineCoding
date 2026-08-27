# Fruit Into Baskets (LeetCode #904)

> Fruit Into Baskets (LeetCode #904)

Longest subarray containing at most 2 distinct values.

## Intuition

"At most K distinct" is the standard variable-size sliding window: expand
right always, and shrink from the left only while the window is INVALID
(more than K distinct). Every valid window is measured, so the maximum is
found in one pass.

A Map of value → count is what makes "how many distinct?" O(1); delete the
key when its count hits zero or the distinct count never drops.

## Dry run

[1,2,3,2,2], K=2
```text
  window grows to [1,2] len 2
  3 arrives → 3 distinct → shrink until [2,3]
  then [2,3,2,2] len 4 → answer 4
```

## Time

O(n) -- each index enters and leaves once   SPACE: O(K)
