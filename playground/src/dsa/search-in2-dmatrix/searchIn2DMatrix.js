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
