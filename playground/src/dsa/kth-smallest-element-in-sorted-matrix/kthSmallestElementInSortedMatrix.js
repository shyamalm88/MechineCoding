// ============================================================================
// APPROACH: Binary Search on VALUE + "Staircase" Count
// ============================================================================
/**
 * STORY / INTUITION:
 * We're not searching for a specific value's INDEX — we're searching for a
 * VALUE such that "exactly k elements are <= this value". Binary search the
 * answer over the range [matrix[0][0], matrix[n-1][n-1]] (smallest possible
 * value to largest possible value).
 *
 * For a candidate `mid`, count how many elements are <= mid using the same
 * "staircase" walk from `searchIn2DMatrixII.js`: start at the BOTTOM-LEFT
 * corner.
 * - If matrix[row][col] <= mid: every cell ABOVE it in this column is also
 *   <= mid (columns are sorted ascending), so add (row + 1) to the count,
 *   then step RIGHT to check the next column.
 * - Else: this cell is too big, step UP to a smaller value in this column.
 *
 * This count is O(n) and MONOTONIC in mid (bigger mid -> count never
 * decreases), which is exactly what binary search needs.
 *
 * Binary search invariant: find the SMALLEST value `lo` for which
 * count(<= lo) >= k. That value is guaranteed to be an actual matrix entry
 * (the kth smallest), even with duplicates.
 *
 * DRY RUN: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
 * Flattened sorted: 1,5,9,10,11,12,13,13,15 -> 8th smallest = 13
 *
 * lo=1, hi=15
 * mid=8:  count(<=8)  = {1,5}            = 2  < 8 -> lo=9
 * mid=12: count(<=12) = {1,5,9,10,11,12} = 6  < 8 -> lo=13
 * mid=14: count(<=14) = {1,5,9,10,11,12,13,13} = 8 >= 8 -> hi=14
 * mid=13: count(<=13) = {1,5,9,10,11,12,13,13} = 8 >= 8 -> hi=13
 * lo == hi == 13 -> return 13 ✓
 *
 * Time:  O(n * log(max - min)) — O(n) count per binary-search step
 * Space: O(1)
 */
const kthSmallest = (matrix, k) => {
  const n = matrix.length;

  const countLessEqual = (target) => {
    let count = 0;
    let row = n - 1;
    let col = 0;

    while (row >= 0 && col < n) {
      if (matrix[row][col] <= target) {
        count += row + 1; // entire column above (and including) `row` qualifies
        col++;
      } else {
        row--;
      }
    }

    return count;
  };

  let lo = matrix[0][0];
  let hi = matrix[n - 1][n - 1];

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (countLessEqual(mid) < k) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return lo;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Kth Smallest Element in a Sorted Matrix Tests ===\n");

console.log("Test 1:", kthSmallest([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8)); // Expected: 13
console.log("Test 2:", kthSmallest([[-5]], 1)); // Expected: -5
console.log("Test 3:", kthSmallest([[1, 2], [1, 3]], 2)); // Expected: 1
console.log("Test 4:", kthSmallest([[1, 2], [1, 3]], 1)); // Expected: 1

module.exports = { kthSmallest };
