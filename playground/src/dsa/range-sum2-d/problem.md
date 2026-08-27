# Range Sum Query 2D - Immutable (LeetCode #304)

Given a 2D matrix, handle multiple queries of the following type:
Calculate the sum of the elements of matrix inside the rectangle defined
by its upper left corner (row1, col1) and lower right corner (row2, col2).

Example:
matrix = [
```text
  [3,0,1,4,2],
  [5,6,3,2,1],
  [1,2,0,1,5],
  [4,1,0,1,7],
  [1,0,3,0,5]
```

]
sumRegion(2,1,4,3) -> 8
sumRegion(1,1,2,2) -> 11
sumRegion(1,2,2,4) -> 12

Constraints:
- 1 <= matrix.length, matrix[i].length <= 200
- -10^5 <= matrix[i][j] <= 10^5
- 0 <= row1 <= row2 < matrix.length
- 0 <= col1 <= col2 < matrix[0].length
- At most 10^4 calls will be made to sumRegion.
