# Search a 2D Matrix II (LeetCode #240)

Search a 2D Matrix II (LeetCode 240)

## Intuition

The matrix has different properties than Matrix I:
```text
  1. Each row is sorted in ascending order (left to right)
  2. Each column is sorted in ascending order (top to bottom)
  BUT first element of next row is NOT necessarily > last element of previous row
```

KEY INSIGHT - Start from TOP-RIGHT corner (or BOTTOM-LEFT):
```text
  At position (r, c), the current element acts as a "pivot":
  - Everything to the LEFT is smaller (row is sorted)
  - Everything BELOW is larger (column is sorted)
```

```text
  This gives us a decision tree at each step:
  - If target > current: Move DOWN (eliminate current row)
  - If target < current: Move LEFT (eliminate current column)
  - If target == current: Found!
```

WHY TOP-RIGHT or BOTTOM-LEFT?
```text
  - Top-left corner: both right and down are larger → can't decide
  - Bottom-right corner: both left and up are smaller → can't decide
  - Top-right/Bottom-left: one direction larger, one smaller → can eliminate!
```

VISUALIZATION (starting top-right):
```text
  [1,  4,  7,  11, →15←]  ← Start here
  [2,  5,  8,  12,  19]
  [3,  6,  9,  16,  22]
  [10, 13, 14, 17,  24]
```

```text
  Looking for 5: 15→11→7→4→5 ✓ (staircase pattern)
```

## Time

O(m + n) - at most m+n steps (move down m times OR left n times)

## Space

O(1) - only using two pointers
