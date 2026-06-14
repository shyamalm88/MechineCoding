/**
 * Search a 2D Matrix (LeetCode 74)
 *
 * INTUITION:
 * The matrix has two key properties:
 *   1. Each row is sorted in ascending order (left to right)
 *   2. First element of each row > last element of previous row
 *
 * This means if we flatten the matrix, it forms a single sorted array!
 *
 * APPROACH:
 * Step 1: Find the correct row where target could exist
 *   - Target must be >= first element AND <= last element of that row
 *   - Linear scan through rows (could optimize with binary search on first column)
 *
 * Step 2: Binary search within the selected row
 *   - Standard binary search since the row is sorted
 *
 * TIME: O(m + log n) - m rows to scan + binary search in n columns
 * SPACE: O(1) - only using pointers
 *
 * ALTERNATIVE: Treat entire matrix as 1D array
 *   - Use single binary search with index mapping: row = idx/cols, col = idx%cols
 *   - This gives O(log(m*n)) time
 */
const searchIn2DMatrix = (grid, target) => {
  if (!grid || !grid.length) return false;
  let row = grid.length;
  let col = grid[0].length;

  // Step 1: Find the row where target could possibly exist
  let selectableRow = -1;

  for (let r = 0; r < row; r++) {
    // Check if target falls within the range of this row
    if (target >= grid[r][0] && target <= grid[r][col - 1]) {
      selectableRow = r;
      break;
    }
  }

  // Target doesn't fit in any row's range
  if (selectableRow === -1) return false;

  // Step 2: Binary search within the selected row
  let left = 0;
  let right = col - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (grid[selectableRow][mid] === target) {
      return true;
    } else if (target >= grid[selectableRow][mid]) {
      left = mid + 1; // Target is in right half
    } else {
      right = mid - 1; // Target is in left half
    }
  }
  return false;
};
