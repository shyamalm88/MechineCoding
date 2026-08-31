# Best Time to Buy and Sell Stock (LeetCode #121) — ONE transaction

Given prices[], choose ONE day to buy and ONE later day to sell.
Return the maximum profit. Return 0 if no profit possible.

Example 1:
Input: prices=[7,1,5,3,6,4] → Output: 5  (buy at 1, sell at 6)

Example 2:
Input: prices=[7,6,4,3,1] → Output: 0  (prices only drop)

Constraints:
- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^4

## Approach

One Pass — Track minimum price seen so far

## Story / intuition

As you walk through price history, remember the CHEAPEST day you've seen so far.
On each day, ask: "If I sell TODAY, what's my profit?" = today - minSoFar.
Track the maximum of all such profits.

This is Kadane's algorithm applied to profit differences (price[i] - price[i-1]).

## Dry run

[7,1,5,3,6,4]
min=7, profit=0
price=7: min=7, profit=max(0, 7-7)=0
price=1: min=1, profit=max(0, 1-1)=0
price=5: min=1, profit=max(0, 5-1)=4
price=3: min=1, profit=max(4, 3-1)=4
price=6: min=1, profit=max(4, 6-1)=5 ✓
price=4: min=1, profit=max(5, 4-1)=5
Result: 5 ✓

Time:  O(N)
Space: O(1)
