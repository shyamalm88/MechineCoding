# Remove Duplicates from Sorted Array (LeetCode #26)

> Remove Duplicates from Sorted Array (LeetCode #26)

Remove duplicates IN PLACE so each value appears once; return the new length.
The first k elements must hold the result.

## Intuition

Slow/fast pointers on sorted input. `slow` marks the end of the deduplicated
prefix; `fast` scans ahead. Because the array is sorted, a duplicate is only
ever adjacent, so comparing nums[fast] to nums[slow] is sufficient.

## Dry run

[0,0,1,1,1,2]
```text
  fast=1 equal → skip
  fast=2 differs → slow=1, nums[1]=1
  fast=3,4 equal → skip
  fast=5 differs → slow=2, nums[2]=2
  length = 3, array starts [0,1,2]
```

## Time

O(n)   SPACE: O(1)
