# Search in Rotated Sorted Array II (LeetCode #81)

> Search in Rotated Sorted Array II (LeetCode #81)

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
