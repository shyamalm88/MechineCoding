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
