# Best Time to Buy and Sell Stock with Transaction Fee (LeetCode #714)

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

## Approach

DP — Two states (cash: not holding, hold: holding stock)

## Story / intuition

Two states: cash (not holding stock) and hold (holding stock).

cash = max(cash, hold + price - fee)  // stay idle OR sell today (minus fee)
hold = max(hold, cash - price)        // keep holding OR buy today

Fee applied on SELL (not buy). Initial: cash=0, hold=-Infinity.

This is the same as Stock II (unlimited) but with a "tax" on each sell.
Small sells become unprofitable → we naturally skip small upswings.

## Dry run

prices=[1,3,2,8,4,9], fee=2
```text
          cash    hold
```

init:      0     -Inf
p=1:       0      -1    (hold=max(-Inf,0-1)=-1)
p=3:       0      -1    (cash=max(0,-1+3-2)=0; profit=0, hold unchanged)
p=2:       0      -1    (cash=max(0,-1+2-2)=max(0,-1)=0; hold=max(-1,0-2)=-1)
p=8:       5      -1    (cash=max(0,-1+8-2)=5; hold=max(-1,0-8)=-1)
p=4:       5       1    (cash=max(5,1+4-2)=max(5,3)=5; hold=max(-1,5-4)=1)
p=9:       8       1    (cash=max(5,1+9-2)=max(5,8)=8; hold unchanged)
Result: cash=8 ✓

Time:  O(N)
Space: O(1)
