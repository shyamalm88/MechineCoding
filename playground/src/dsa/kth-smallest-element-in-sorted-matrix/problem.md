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

## Approach

Binary Search on VALUE + "Staircase" Count

## Story / intuition

We're not searching for a specific value's INDEX — we're searching for a
VALUE such that "exactly k elements are <= this value". Binary search the
answer over the range [matrix[0][0], matrix[n-1][n-1]] (smallest possible
value to largest possible value).

For a candidate `mid`, count how many elements are <= mid using the same
"staircase" walk from `searchIn2DMatrixII.js`: start at the BOTTOM-LEFT
corner.
- If matrix[row][col] <= mid: every cell ABOVE it in this column is also
```text
  <= mid (columns are sorted ascending), so add (row + 1) to the count,
  then step RIGHT to check the next column.
```

- Else: this cell is too big, step UP to a smaller value in this column.

This count is O(n) and MONOTONIC in mid (bigger mid -> count never
decreases), which is exactly what binary search needs.

Binary search invariant: find the SMALLEST value `lo` for which
count(<= lo) >= k. That value is guaranteed to be an actual matrix entry
(the kth smallest), even with duplicates.

## Dry run

matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
Flattened sorted: 1,5,9,10,11,12,13,13,15 -> 8th smallest = 13

lo=1, hi=15
mid=8:  count(<=8)  = {1,5}            = 2  < 8 -> lo=9
mid=12: count(<=12) = {1,5,9,10,11,12} = 6  < 8 -> lo=13
mid=14: count(<=14) = {1,5,9,10,11,12,13,13} = 8 >= 8 -> hi=14
mid=13: count(<=13) = {1,5,9,10,11,12,13,13} = 8 >= 8 -> hi=13
lo == hi == 13 -> return 13 ✓

Time:  O(n * log(max - min)) — O(n) count per binary-search step
Space: O(1)
