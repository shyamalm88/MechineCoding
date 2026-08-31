# Permutations (LeetCode #46)

Given an array nums of distinct integers, return all the possible permutations.
You can return the answer in any order.

Example 1:
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

Example 2:
Input: nums = [0,1]
Output: [[0,1],[1,0]]

Constraints:
- 1 <= nums.length <= 6
- -10 <= nums[i] <= 10
- All the integers of nums are unique.

## Approach

Backtracking (Swapping)

## Intuition

To generate all permutations, we can fix one number at the current position
and recursively permute the remaining positions.
We can do this in-place by swapping elements to place them in the "current"
position, recursing, and then swapping back (backtracking) to restore the state.

Time Complexity: O(N * N!) - There are N! permutations, and copying takes O(N).
Space Complexity: O(N) - Recursion stack.
