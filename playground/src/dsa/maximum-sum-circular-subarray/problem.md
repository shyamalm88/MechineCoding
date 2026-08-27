# Maximum Sum Circular Subarray (LeetCode #918)

> Maximum Sum Circular Subarray (LeetCode #918)

Given a circular integer array nums, return the maximum possible sum of a
non-empty subarray. The array is circular (end wraps to beginning).

Example 1:
Input: nums=[1,-2,3,-2] → Output: 3  (subarray [3])
Example 2:
Input: nums=[5,-3,5] → Output: 10   (wrap-around: [5,5], skipping -3)
Example 3:
Input: nums=[-3,-2,-3] → Output: -2  (all negative, must take at least one)

Constraints:
- n == nums.length
- 1 <= n <= 3 * 10^4
- -3 * 10^4 <= nums[i] <= 3 * 10^4
