# Subarray Sums Divisible by K (LeetCode #974)

## Category

🟢 IMPORTANT (Prefix Sum + Modular HashMap)
Given an integer array nums and an integer k, return the number of
non-empty CONTIGUOUS subarrays that have a sum divisible by k.

Example 1:
Input: nums=[4,5,0,-2,-3,1], k=5 → Output: 7
Explanation: [4,5,0,-2,-3,1], [5], [5,0], [5,0,-2,-3], [0], [0,-2,-3], [-2,-3]

Example 2:
Input: nums=[5], k=9 → Output: 0

Constraints:
- 1 <= nums.length <= 3 * 10^4
- -10^4 <= nums[i] <= 10^4
- 2 <= k <= 10^4
