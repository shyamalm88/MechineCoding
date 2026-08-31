# Minimum Number of Arrows to Burst Balloons (LeetCode #452)

Balloons are represented as [xstart, xend] (horizontal spread on x-axis).
An arrow shot at x bursts every balloon where xstart <= x <= xend.
Return the minimum number of arrows needed to burst all balloons.

Example 1:
Input: [[10,16],[2,8],[1,6],[7,12]] → Output: 2
(Arrow at 6 bursts [2,8],[1,6]. Arrow at 11 bursts [10,16],[7,12])

Example 2:
Input: [[1,2],[3,4],[5,6],[7,8]] → Output: 4  (no overlaps)

Example 3:
Input: [[1,2],[2,3],[3,4],[4,5]] → Output: 2

Constraints:
- 1 <= points.length <= 10^5
- points[i].length == 2
- -2^31 <= xstart < xend <= 2^31 - 1

## Approach

Greedy — Sort by END, shoot at each balloon's end as late as possible

## Story / intuition

Sort balloons by their END position. Greedily shoot an arrow at the END of
the first balloon — this covers the maximum possible overlapping balloons
(any balloon that starts <= this end is burst by this arrow).

When we find a balloon that STARTS after the current arrow position,
we need a NEW arrow. Set the new arrow at that balloon's end.

WHY SORT BY END? Shooting at the end of a balloon is always at least as
good as shooting anywhere else — it maximizes the chance of hitting
subsequent balloons.

## Dry run

[[1,6],[2,8],[7,12],[10,16]] sorted by end:
arrow=6, arrows=1 (shoot at end of [1,6])
[2,8]: start=2 <= 6 → burst by arrow. Skip.
[7,12]: start=7 > 6 → new arrow at 12. arrows=2.
[10,16]: start=10 <= 12 → burst. Skip.
Result: 2 ✓

Time:  O(N log N)
Space: O(1)
