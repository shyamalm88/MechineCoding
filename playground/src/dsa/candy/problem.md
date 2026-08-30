# Candy (LeetCode #135)

N children stand in a line, each with a rating. You are distributing candy
under two rules:

1. Every child must get at least one candy.
2. A child with a HIGHER rating than an immediate neighbour must get MORE
candies than that neighbour.

Return the minimum number of candies you need.

Example 1:
Input: ratings = [1,0,2] → Output: 5 (candies [2,1,2])

Example 2:
Input: ratings = [1,2,2] → Output: 4 (candies [1,2,1] — equal ratings carry
no obligation in either direction)

Constraints:
- 1 <= ratings.length <= 2 * 10^4
- 0 <= ratings[i] <= 2 * 10^4
