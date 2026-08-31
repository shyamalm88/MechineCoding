# IPO (LeetCode #502)

You have w units of starting capital and may finish AT MOST k distinct
projects. Project i requires capital[i] to start and yields a pure profit of
profits[i], which is added to your capital when finished. Projects cannot be
repeated. Return the maximum capital you can end with.

Example 1:
Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1] → Output: 4
(Start project 0 → capital 1. Now project 2 is affordable → capital 4.)

Example 2:
Input: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2] → Output: 6

Constraints:
- 1 <= k <= 10^5
- 0 <= w <= 10^9
- 1 <= profits.length == capital.length <= 10^5

## Approach

Sort by Capital, Max-Heap on Profit — "Unlock, Then Take the Best"

## Story / intuition

Two forces pull against each other: a project must be AFFORDABLE (capital
gate) and you want it to be PROFITABLE. Sorting by one ruins the other, so
use a different structure for each:

```text
  - Sort projects by required capital ASC. A moving pointer walks this list
    and "unlocks" every project you can now afford. Because w only ever grows,
    the pointer never rewinds — each project is unlocked at most once.
  - Push unlocked projects' profits into a MAX-HEAP. Each round, take the top.
```

Repeat k times, or stop early when the heap is empty (nothing affordable is
left, and since w cannot grow without finishing a project, it never will be).

## Why the greedy choice is safe

Profits are non-negative, so capital is monotonically non-decreasing. That
means the set of affordable projects only ever GROWS — taking the most
profitable one now never locks you out of anything later. Formally: if an
optimal plan takes project p while a strictly more profitable affordable
project q is available, swapping p for q leaves capital at least as high at
every subsequent step, so every later choice in the optimal plan remains
affordable. Greedy is therefore never behind.

## Dry run

k=2, w=0, profits=[1,2,3], capital=[0,1,1]
sorted by capital → [(0,1), (1,2), (1,3)]
round 1: unlock capital <= 0 → push 1. heap {1}. pop 1 → w = 1
round 2: unlock capital <= 1 → push 2, push 3. heap {3,2}. pop 3 → w = 4
answer 4

Time:  O(N log N) — sort plus at most N heap pushes/pops
Space: O(N)

 Minimal binary max-heap — the files here are self-contained by convention.
