# Search a 2D Matrix (LeetCode #74)

> Search a 2D Matrix (LeetCode #74)

Search a 2D Matrix (LeetCode 74)

## Intuition

The matrix has two key properties:
```text
  1. Each row is sorted in ascending order (left to right)
  2. First element of each row > last element of previous row
```

This means if we flatten the matrix, it forms a single sorted array!

## Approach

Step 1: Find the correct row where target could exist
```text
  - Target must be >= first element AND <= last element of that row
  - Linear scan through rows (could optimize with binary search on first column)
```

Step 2: Binary search within the selected row
```text
  - Standard binary search since the row is sorted
```

## Time

O(m + log n) - m rows to scan + binary search in n columns

## Space

O(1) - only using pointers

## Alternative

Treat entire matrix as 1D array
```text
  - Use single binary search with index mapping: row = idx/cols, col = idx%cols
  - This gives O(log(m*n)) time
```
