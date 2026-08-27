# Best Time to Buy and Sell Stock III (LeetCode #123) — AT MOST 2 transactions

At most 2 transactions total. Must sell before buying again.
Return the maximum profit.

Example 1:
Input: prices=[3,3,5,0,0,3,1,4] → Output: 6
(buy@0,sell@3=3; buy@1,sell@4=3 → total 6)

Example 2:
Input: prices=[1,2,3,4,5] → Output: 4  (1 transaction: buy@1,sell@5)

Example 3:
Input: prices=[7,6,4,3,1] → Output: 0

Constraints:
- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^5
