# Two City Scheduling (LeetCode #1029)

A company is interviewing 2N people. costs[i] = [aCost_i, bCost_i] is the
cost of flying person i to city A or city B. Return the minimum total cost
to fly EXACTLY N people to each city.

Example 1:
Input: costs = [[10,20],[30,200],[400,50],[30,20]] → Output: 110
(Person 0 → A (10), person 1 → A (30), person 2 → B (50), person 3 → B (20))

Example 2:
Input: costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]
Output: 1859

Constraints:
- 2 * N == costs.length
- 2 <= costs.length <= 100, costs.length is even
- 1 <= aCost_i, bCost_i <= 1000

## Approach

Sort by the REGRET of Sending Someone to B Instead of A

## Story / intuition

The naive instinct — "send everyone to their cheaper city" — fails, because
the split must be exactly N/N. The real question is not "which city is
cheaper for this person" but "how much do we REGRET not sending them to A".

Pretend you send EVERYONE to city A first. Now you must move exactly N people
to B, and moving person i changes the bill by (bCost - aCost). Some of those
deltas are negative (a bargain — they were always better off in B), some
positive (a penalty). To minimise the total, move the N people with the
SMALLEST deltas.

Sorting by (aCost - bCost) ascending puts the strongest A-preferences first:
the first half flies to A, the second half to B.

WHY THE GREEDY CHOICE IS SAFE (exchange argument):
Take any optimal assignment. Suppose person x goes to B and person y goes to
A while x has a strictly larger (aCost - bCost) than y — i.e. they are in the
"wrong" order. Swap their cities. The count constraint is untouched (still
N/N), and the cost changes by (aX + bY) - (bX + aY) = (aX - bX) - (aY - bY),
which is > 0 — so the swap strictly IMPROVES the original. An optimal
solution admits no improving swap, so it must already be in sorted order.

## Dry run

[[10,20],[30,200],[400,50],[30,20]]
deltas (a-b): -10, -170, +350, +10
sorted by delta → [30,200](-170), [10,20](-10), [30,20](+10), [400,50](+350)
first half → A: 30 + 10 = 40
second half → B: 20 + 50 = 70
total 110

Time:  O(N log N) — the sort
Space: O(1) extra (sorts in place)
