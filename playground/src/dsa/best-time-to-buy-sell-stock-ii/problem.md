# Best Time to Buy and Sell Stock II (LeetCode #122) — UNLIMITED transactions

Buy and sell as many times as you want (but can only hold 1 share at a time).
Return the maximum profit.

Example 1:
Input: prices=[7,1,5,3,6,4] → Output: 7  (buy@1,sell@5=+4; buy@3,sell@6=+3)

Example 2:
Input: prices=[1,2,3,4,5] → Output: 4  (buy@1, sell@5; or buy every day sell next)

Example 3:
Input: prices=[7,6,4,3,1] → Output: 0

Constraints:
- 1 <= prices.length <= 3 * 10^4
- 0 <= prices[i] <= 10^4
