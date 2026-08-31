# Longest Increasing Subsequence (LeetCode #300)

Given an integer array nums, return the length of the longest strictly
increasing subsequence.

Example 1:
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.

Example 2:
Input: nums = [0,1,0,3,2,3]
Output: 4

Constraints:
- 1 <= nums.length <= 2500
- -10^4 <= nums[i] <= 10^4

## Approach

Dynamic Programming

## Intuition

Let dp[i] be the length of the longest increasing subsequence ending at index i.
To calculate dp[i], we look at all previous indices j < i.
If nums[j] < nums[i], we can extend the subsequence ending at j.
dp[i] = max(dp[i], dp[j] + 1).

Time Complexity: O(N^2)
Space Complexity: O(N)
