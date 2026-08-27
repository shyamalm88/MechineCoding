# Kth Smallest Element in a Sorted Matrix (LeetCode #378)

Given an n x n matrix where each of the rows and columns is sorted in
ascending order, return the kth smallest element in the matrix.

Note: it is the kth smallest element in the SORTED ORDER, not the kth
distinct element.

Example 1:
Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
Output: 13

Example 2:
Input: matrix = [[-5]], k = 1
Output: -5

Constraints:
- n == matrix.length == matrix[i].length
- 1 <= n <= 300
- -10^9 <= matrix[i][j] <= 10^9
- All the rows and columns of matrix are guaranteed to be sorted in
```text
  non-decreasing order.
```

- 1 <= k <= n^2
