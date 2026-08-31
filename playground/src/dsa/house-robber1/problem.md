# House Robber (LeetCode #198)

You are a professional robber planning to rob houses along a street. Each house
has a certain amount of money stashed, the only constraint stopping you from
robbing each of them is that adjacent houses have security systems connected
and it will automatically contact the police if two adjacent houses were
broken into on the same night.

Given an integer array nums representing the amount of money of each house,
return the maximum amount of money you can rob tonight without alerting the police.

Example 1:
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.

Constraints:
- 1 <= nums.length <= 100
- 0 <= nums[i] <= 400

## Approach

Dynamic Programming (Top-Down)

## Intuition

At each house `i`, we have two choices:
1. Rob this house: Add money[i] and move to house `i+2`.
2. Skip this house: Move to house `i+1`.

Recurrence: dp[i] = max(money[i] + dp[i+2], dp[i+1])

Time Complexity: O(N)
Space Complexity: O(N)
