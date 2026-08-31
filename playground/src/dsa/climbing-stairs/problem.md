# Climbing Stairs (LeetCode #70)

You are climbing a staircase. It takes n steps to reach the top.
Each time you can either climb 1 or 2 steps. In how many distinct ways can
you climb to the top?

Example 1:
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps

Example 2:
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step

Constraints:
- 1 <= n <= 45

## Approach

Dynamic Programming (Bottom-Up)

## Intuition

To reach step `i`, we could have come from step `i-1` (taking 1 step)
or from step `i-2` (taking 2 steps).
So, ways[i] = ways[i-1] + ways[i-2].
This is exactly the Fibonacci sequence.

Time Complexity: O(N)
Space Complexity: O(N) (Can be optimized to O(1))
