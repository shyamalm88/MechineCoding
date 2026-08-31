# Find First and Last Position of Element in Sorted Array (LeetCode #34)

Given an array of integers nums sorted in non-decreasing order, find the
starting and ending position of a given target value.

If target is not found in the array, return [-1, -1].

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]

Example 2:
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]

Example 3:
Input: nums = [], target = 0
Output: [-1,-1]

Constraints:
- 0 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9
- nums is a non-decreasing array.
- -10^9 <= target <= 10^9

## Approach

Double Binary Search

## Intuition

Since the array is sorted, we can use Binary Search. However, simply finding
*a* target isn't enough; we need the boundaries.

We can run Binary Search twice:
1. findLeft: Find the first occurrence.
```text
   - When nums[mid] == target, we found a candidate. But there might be
     another instance to the left. So, we store `mid` and move `right` to `mid - 1`.
```

2. findRight: Find the last occurrence.
```text
   - When nums[mid] == target, we found a candidate. But there might be
     another instance to the right. So, we store `mid` and move `left` to `mid + 1`.
```

## Dry run

Input: nums = [5, 7, 7, 8, 8, 10], target = 8

1. findLeft(nums, 8):
```text
   - L=0, R=5, Mid=2 (val=7). 7 < 8. L = 3.
   - L=3, R=5, Mid=4 (val=8). 8 == 8. ans=4. Look Left -> R = 3.
   - L=3, R=3, Mid=3 (val=8). 8 == 8. ans=3. Look Left -> R = 2.
   - L=3, R=2. Loop ends. Return 3.
```

2. findRight(nums, 8):
```text
   - L=0, R=5, Mid=2 (val=7). 7 < 8. L = 3.
   - L=3, R=5, Mid=4 (val=8). 8 == 8. ans=4. Look Right -> L = 5.
   - L=5, R=5, Mid=5 (val=10). 10 > 8. R = 4.
   - L=5, R=4. Loop ends. Return 4.
```

Result: [3, 4]

Time Complexity: O(log N) - Two binary searches.
Space Complexity: O(1)
