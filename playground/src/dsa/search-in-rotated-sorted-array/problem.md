# Search in Rotated Sorted Array (LeetCode #33)

There is an integer array nums sorted in ascending order (with distinct values).
Prior to being passed to your function, nums is possibly rotated at an unknown
pivot index k (1 <= k < nums.length).

Given the array nums after the possible rotation and an integer target, return
the index of target if it is in nums, or -1 if it is not in nums.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4

Example 2:
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1

Constraints:
- 1 <= nums.length <= 5000
- -10^4 <= nums[i], target <= 10^4
- All values of nums are unique.

## Approach

Binary Search (Find Sorted Half)

## Intuition

In a rotated sorted array, at least one half (left or right) is always sorted.
1. Find Mid.
2. Check if Left side is sorted (nums[left] <= nums[mid]).
```text
   - If yes, check if target is in that range. If so, go Left. Else go Right.
```

3. Else (Right side must be sorted).
```text
   - Check if target is in that range. If so, go Right. Else go Left.
```

Time Complexity: O(log N)
Space Complexity: O(1)
