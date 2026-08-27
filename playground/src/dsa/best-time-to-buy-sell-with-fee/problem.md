# Best Time to Buy and Sell Stock with Transaction Fee (LeetCode #714)

> Best Time to Buy and Sell Stock with Transaction Fee (LeetCode #714)

Unlimited transactions but each SELL incurs a transaction fee.
Return the maximum profit after fees.

Example 1:
Input: prices=[1,3,2,8,4,9], fee=2 → Output: 8
Explanation: buy@1 sell@8(-2fee)=+5, buy@4 sell@9(-2fee)=+3 → total 8

Example 2:
Input: prices=[1,3,7,5,10,3], fee=3 → Output: 6

Constraints:
- 1 <= prices.length <= 5 * 10^4
- 1 <= prices[i] < 5 * 10^4
- 0 <= fee < 5 * 10^4
