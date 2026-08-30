# Wiggle Subsequence (LeetCode #376)

A wiggle sequence is one where the differences between successive numbers
strictly alternate between positive and negative. A sequence of one element,
and any two unequal elements, are trivially wiggle sequences.

Given an integer array nums, return the length of the LONGEST wiggle
SUBSEQUENCE (elements may be deleted; order is preserved).

Example 1:
Input: nums = [1,7,4,9,2,5] → Output: 6
(The whole array already wiggles: +6,-3,+5,-7,+3)

Example 2:
Input: nums = [1,17,5,10,13,15,10,5,16,8] → Output: 7
(One choice: [1,17,10,13,10,16,8])

Constraints:
- 1 <= nums.length <= 1000
- 0 <= nums[i] <= 1000
