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

## Approach

4-State DP — Track 2 transactions independently

## Story / intuition

With at most 2 transactions, track 4 states representing the best profit at
each phase of the trading lifecycle:

```text
  buy1  = best profit after 1st BUY  (spent money, holding stock 1)
  sell1 = best profit after 1st SELL (have profit from 1st transaction)
  buy2  = best profit after 2nd BUY  (spent from sell1 profit, holding stock 2)
  sell2 = best profit after 2nd SELL (final profit)
```

Transitions:
```text
  buy1  = max(buy1, -price)           // buy for first time
  sell1 = max(sell1, buy1 + price)    // sell first stock
  buy2  = max(buy2, sell1 - price)    // buy second stock (net of 1st profit)
  sell2 = max(sell2, buy2 + price)    // sell second stock = final answer
```

## Dry run

prices=[3,3,5,0,0,3,1,4]
```text
          buy1  sell1  buy2  sell2
```

init:     -Inf    0   -Inf    0
p=3:      -3      0    -3     0   (buy1=-3,sell1=max(0,-3+3)=0,buy2=max(-Inf,0-3)=-3,sell2=max(0,-3+3)=0)
p=3:      -3      0    -3     0
p=5:      -3      2    -3     2   (sell1=-3+5=2, sell2=-3+5=2)
p=0:      -0=0    2    2-0=2  2   (buy1=max(-3,-0)=0, buy2=max(-3,2-0)=2)
p=0:       0      2    2      2
p=3:       0      3    2      5   (sell1=0+3=3, sell2=2+3=5)
p=1:       0      3    2      5   (buy1=max(0,-1)=0, buy2=max(2,3-1)=2)
p=4:       0      4    3      6   (sell1=0+4=4, buy2=max(2,4-1)=3, sell2=3+4=7? wait
```text
  sell2=max(5,buy2+4)=max(5,2+4)=max(5,6)=6)
```

Result: sell2 = 6 ✓

Time:  O(N)
Space: O(1)
