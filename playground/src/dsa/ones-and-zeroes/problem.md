# Ones and Zeroes (LeetCode #474)

> Ones and Zeroes (LeetCode #474)

## Category

🔴 VVIMP (2D 0/1 Knapsack — Two Capacity Dimensions)
You are given an array of binary strings `strs` and two integers `m` and `n`.

Return the size of the largest subset of `strs` such that there are AT MOST
`m` 0's and `n` 1's in total across the subset.

Example 1:
Input: strs=["10","0001","111001","1","0"], m=5, n=3
Output: 4
Explanation: subset {"10","0001","1","0"} uses 5 zeros and 3 ones (4 items).

Example 2:
Input: strs=["10","0","1"], m=1, n=1
Output: 2
Explanation: subset {"0","1"} uses 1 zero and 1 one.

Constraints:
- 1 <= strs.length <= 600
- 1 <= strs[i].length <= 100
- strs[i] consists only of '0' and '1'
- 1 <= m, n <= 100
