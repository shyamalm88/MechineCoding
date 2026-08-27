# Best Time to Buy and Sell Stock with Cooldown (LeetCode #309)

Unlimited transactions, but after selling you must WAIT 1 day (cooldown) before buying.
Return the maximum profit.

Example 1:
Input: prices=[1,2,3,0,2] → Output: 3  (buy@1,sell@2, cooldown, buy@0,sell@2)

Example 2:
Input: prices=[1] → Output: 0

Constraints:
- 1 <= prices.length <= 5000
- 0 <= prices[i] <= 1000
