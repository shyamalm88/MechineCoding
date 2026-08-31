# Combination Sum IV (LeetCode #377)

Given an array of distinct positive integers nums and a positive integer target,
return the number of possible combinations that add up to target.
ORDER MATTERS (different orderings counted as different combinations).

Example 1:
Input: nums=[1,2,3], target=4
Output: 7
Explanations: (1+1+1+1), (1+1+2), (1+2+1), (1+3), (2+1+1), (2+2), (3+1)

Example 2:
Input: nums=[9], target=3 → Output: 0

Constraints:
- 1 <= nums.length <= 200
- 1 <= nums[i] <= 1000
- All elements of nums are unique
- 1 <= target <= 1000

## Approach

DP — "Unbounded Knapsack with ordered counting"

## Story / intuition

DIFFERENCE FROM COMBINATION SUM (#39): Order matters here.
[1,2] and [2,1] are counted separately → this is a PERMUTATION count, not combination.

DP: dp[i] = number of ways to reach sum i using any numbers in any order.

Transition: To reach sum i, we could have arrived from sum (i - num) for any num in nums.
```text
  dp[i] = sum of dp[i - num] for all num where num <= i
```

Base case: dp[0] = 1 (one way to reach 0: pick nothing)

KEY DIFFERENCE from Coin Change (#322 - unordered):
```text
  In Coin Change, outer loop = coins, inner loop = amount → each coin considered once
  Here, outer loop = AMOUNT, inner loop = nums → each amount re-considers all nums
  This double-counting is what creates the ordered permutations!
```

## Dry run

nums=[1,2,3], target=4
dp=[1,0,0,0,0]
i=1: dp[1] += dp[0](use 1)=1 → dp=[1,1,0,0,0]
i=2: dp[2] += dp[1](use 1)=1, dp[0](use 2)=1 → dp=[1,1,2,0,0]
i=3: dp[3] += dp[2](use 1)=2, dp[1](use 2)=1, dp[0](use 3)=1 → dp=[1,1,2,4,0]
i=4: dp[4] += dp[3](use 1)=4, dp[2](use 2)=2, dp[1](use 3)=1 → dp=[1,1,2,4,7]
Result: 7 ✓

Time:  O(target * nums.length)
Space: O(target)
