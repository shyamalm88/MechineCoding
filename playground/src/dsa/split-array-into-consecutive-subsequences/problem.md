# Split Array into Consecutive Subsequences (LeetCode #659)

You are given a SORTED integer array nums (non-decreasing). Determine if it
can be split into one or more subsequences such that each subsequence is a
run of consecutive integers of length AT LEAST 3.

Example 1:
Input: nums = [1,2,3,3,4,5] → Output: true   ([1,2,3] and [3,4,5])
Example 2:
Input: nums = [1,2,3,3,4,4,5,5] → Output: true ([1,2,3,4,5] and [3,4,5])
Example 3:
Input: nums = [1,2,3,4,4,5] → Output: false

Constraints:
- 1 <= nums.length <= 10^4
- -1000 <= nums[i] <= 1000
- nums is sorted in non-decreasing order
