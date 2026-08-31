# Jump Game II (LeetCode #45)

You are given a 0-indexed array of integers nums of length n. You are initially
positioned at nums[0].

Each element nums[i] represents the maximum length of a forward jump from index i.
Return the minimum number of jumps to reach nums[n - 1].
The test cases are generated such that you can reach nums[n - 1].

Example 1:
Input: nums = [2,3,1,1,4]
Output: 2
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.

Constraints:
- 1 <= nums.length <= 10^4
- 0 <= nums[i] <= 1000

## Approach

Greedy (BFS-like levels)

## Intuition

We want to make the fewest jumps. This implies we want to jump as far as possible
within the current range.
We can think of this as BFS levels:
- Level 0: Index 0
- Level 1: All indices reachable from Level 0
- Level 2: All indices reachable from Level 1

`currentEnd` marks the end of the current level.
`farthest` marks the farthest point reachable from the current level.
When we reach `currentEnd`, we increment jumps and update `currentEnd` to `farthest`.

Time Complexity: O(N)
Space Complexity: O(1)
