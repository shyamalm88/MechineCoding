const search2DMatrixII = (matrix, target) => {
  let row = matrix.length;
  let col = matrix[0].length;

  // Start from top-right corner
  let r = 0;
  let c = col - 1;

  // Move in a staircase pattern until we go out of bounds
  while (r < row && c >= 0) {
    if (matrix[r][c] === target) return true;
    if (target > matrix[r][c]) {
      r++; // Target is larger, eliminate this row, move down
    } else {
      c--; // Target is smaller, eliminate this column, move left
    }
  }
  return false;
};
