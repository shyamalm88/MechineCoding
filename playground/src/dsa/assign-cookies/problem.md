# Assign Cookies (LeetCode #455)

Each child i has a greed factor g[i] — the minimum cookie size that will
content them. Each cookie j has size s[j]. A cookie can be given to at most
one child, and a child can receive at most one cookie. A child is content if
s[j] >= g[i]. Return the maximum number of content children.

Example 1:
Input: g = [1,2,3], s = [1,1] → Output: 1
(Only the child with greed 1 can be satisfied.)

Example 2:
Input: g = [1,2], s = [1,2,3] → Output: 2

Constraints:
- 1 <= g.length <= 3 * 10^4
- 0 <= s.length <= 3 * 10^4
- 1 <= g[i], s[j] <= 2^31 - 1

## Approach

Sort Both, Two Pointers — Smallest Cookie That Still Works

## Story / intuition

This is the "hello world" of greedy. Sort children by greed and cookies by
size, then walk both. For the least greedy child still unserved, hand them
the SMALLEST cookie that satisfies them. Any cookie too small for the
current child is too small for every remaining child (they're greedier), so
it is dead weight — discard it and move on.

WHY THE GREEDY CHOICE IS SAFE (exchange argument):
Suppose an optimal solution gives child c a cookie bigger than the smallest
one that fits. Swap it for that smallest fitting cookie. Child c is still
content, and the larger cookie is now free for someone else — so the new
solution is no worse. Repeating the swap turns any optimum into ours.
Spending the smallest sufficient resource never costs you anything.

## Dry run

g = [1,2,3], s = [1,1]
child=0 (greed 1), cookie=0 (size 1): 1 >= 1 → content. child=1, cookie=1
child=1 (greed 2), cookie=1 (size 1): 1 < 2  → cookie wasted. cookie=2
cookie ran out → answer 1

Time:  O(N log N + M log M) — dominated by the two sorts
Space: O(1) extra (sorts in place)
