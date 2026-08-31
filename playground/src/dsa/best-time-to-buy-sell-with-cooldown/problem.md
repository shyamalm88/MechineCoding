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

## Approach

State Machine DP — 3 states

## Story / intuition

Model the problem as a state machine with 3 states:

```text
  HELD  → currently holding a stock
  SOLD  → just sold today (entering cooldown)
  REST  → in cooldown or idle (can buy tomorrow)
```

Transitions:
```text
  held  = max(held, rest - price)   // keep holding OR buy from rest state
  sold  = held + price              // sell what we held today
  rest  = max(rest, sold)           // come off cooldown OR stay idle
```

After cooldown (day after SOLD), we enter REST.
REST can either STAY or transition to HELD (by buying).

Initial state (before any day):
```text
  held = -Infinity (haven't bought yet)
  sold = -Infinity (haven't sold yet)
  rest = 0         (idle with no profit)
```

## Dry run

prices=[1,2,3,0,2]
```text
          held    sold    rest
```

init:    -Inf    -Inf      0
p=1:     -1       -Inf     0    (held=rest-1=-1)
p=2:     -1        1       0    (sold=held+2=1, rest=max(0,-Inf)=0)
p=3:     -1        2       1    (sold=held+3=2, rest=max(0,1)=1)
p=0:      1        2       2    (held=max(-1,rest-0)=1, sold=held+0=-1+0? wait...
```text
          held = max(-1, 2-0) = max(-1,2) = 2? No: prev held=-1, prev rest=1
          held=max(-1, 1-0)=max(-1,1)=1, sold=-1+3=2? prev_held=-1
          Let me redo:
```

After p=3: held=-1, sold=2, rest=1
p=0: new_held=max(-1, rest-0)=max(-1,1)=1
```text
     new_sold=held+0=-1+0=-1 (but use PREV held)
     new_rest=max(rest,sold)=max(1,2)=2
     → held=1, sold=-1, rest=2
```

p=2: new_held=max(1, rest-2)=max(1,2-2)=max(1,0)=1
```text
     new_sold=held+2=1+2=3
     new_rest=max(rest,sold)=max(2,-1)=2
     → held=1, sold=3, rest=2
```

Answer: max(sold, rest) = max(3, 2) = 3 ✓

Time:  O(N)
Space: O(1)
