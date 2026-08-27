# Shortest Subarray with Sum at Least K (LeetCode #862)

Given an integer array nums and an integer k, return the length of the
shortest non-empty subarray of nums with a sum of at least k.
If there is no such subarray, return -1.

## Important

nums can contain NEGATIVE numbers — that's what makes this
harder than Minimum Size Subarray Sum (LC209), where every number is
positive and a plain expand/shrink two-pointer works.

Example 1:
Input: nums = [1], k = 1
Output: 1

Example 2:
Input: nums = [1,2], k = 4
Output: -1

Example 3:
Input: nums = [2,-1,2], k = 3
Output: 3

Constraints:
- 1 <= nums.length <= 10^5
- -10^5 <= nums[i] <= 10^5
- 1 <= k <= 10^9
