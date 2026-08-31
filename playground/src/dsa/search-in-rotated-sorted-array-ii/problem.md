# Search in Rotated Sorted Array II (LeetCode #81)

Like #33 but the array may contain DUPLICATES. Return true if target exists.

Example 1:
Input: nums=[2,5,6,0,0,1,2], target=0 → Output: true

Example 2:
Input: nums=[2,5,6,0,0,1,2], target=3 → Output: false

The tricky case: nums=[1,0,1,1,1], target=0
mid=1 same as nums[left]=1 AND nums[right]=1 → can't determine which half is sorted.

Constraints:
- 1 <= nums.length <= 5000
- -10^4 <= nums[i], target <= 10^4

## Approach

Binary Search with duplicate handling

## Story / intuition

In #33 (no duplicates), when nums[left] <= nums[mid], LEFT half is sorted.
With duplicates, nums[left] == nums[mid] == nums[right] makes it impossible
to determine which side is sorted. Solution: shrink both ends (left++, right--).

This breaks the guarantee of O(log N) in the worst case → O(N) worst case.
(e.g., [1,1,1,1,1,1,0,1] — we might shrink every step)

## Dry run

nums=[2,5,6,0,0,1,2], target=0
lo=0,hi=6 → mid=3. nums[3]=0=target → return true ✓

DRY RUN (tricky): nums=[1,0,1,1,1], target=0
lo=0,hi=4 → mid=2. nums[2]=1. nums[lo]=1 == nums[mid]=1 == nums[hi]=1
```text
  → SHRINK: lo=1, hi=3
```

lo=1,hi=3 → mid=2. nums[2]=1. nums[lo]=0 < nums[mid]=1 → left sorted.
```text
  0 in [0,1)? Yes! → hi=1
```

lo=1,hi=1 → mid=1. nums[1]=0=target → return true ✓

Time:  O(log N) average, O(N) worst case (all duplicates)
Space: O(1)
