# Monotone Increasing Digits (LeetCode #738)

An integer has monotone increasing digits if each digit is <= the digit that
follows it. Given an integer n, return the LARGEST number less than or equal
to n with monotone increasing digits.

Example 1:
Input: n = 10    → Output: 9
Example 2:
Input: n = 1234  → Output: 1234 (already monotone)
Example 3:
Input: n = 332   → Output: 299

Constraints:
- 0 <= n <= 10^9

## Approach

Right-to-Left Scan — Borrow Once, Then Flood With Nines

## Story / intuition

Walk from the RIGHT. Whenever a digit is bigger than the one after it
(d[i-1] > d[i]) the number is not monotone there. Since we may only go DOWN
from n, the fix is to decrement that offending left digit by one and make
everything to its right as large as possible — all 9s.

Why right-to-left? Because decrementing can CASCADE. In 332, fixing the "32"
gives 3-2-9 → but now 3 > 2 is a fresh violation one place left. Scanning
right-to-left catches that cascade for free in a single pass; a left-to-right
scan would need to restart. Track the leftmost position that broke, then
flood everything from there onward with 9.

## Why the greedy choice is safe

At the first (leftmost) violation, the prefix cannot stay as it is — no
assignment of the suffix can repair d[i-1] > d[i]. So the answer must be
strictly smaller in that prefix, and the largest such candidate decrements
exactly one digit by one. Having gone below n in that position, every later
digit is unconstrained by n, so setting them all to 9 is the maximum and is
trivially monotone.

## Dry run

n = 332 → digits [3,3,2]
i=2: d[1]=3 > d[2]=2 → d[1]-- → [3,2,2], marker = 2
i=1: d[0]=3 > d[1]=2 → d[0]-- → [2,2,2], marker = 1   ← the cascade
flood from index 1 → [2,9,9] = 299

## Dry run

n = 668841 → [6,6,8,8,4,1]
i=5: 4>1 → [6,6,8,8,3,1] marker=5
i=4: 8>3 → [6,6,8,7,3,1] marker=4
i=3: 8>7 → [6,6,7,7,3,1] marker=3
i=2: 6>7? no.  i=1: 6>6? no
flood from 3 → [6,6,7,9,9,9] = 667999

Time:  O(D) where D = number of digits (<= 10)
Space: O(D)
