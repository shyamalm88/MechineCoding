function maximalSquare(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  const dp = Array.from({ length: m }, () => Array(n).fill(0));

  let maxSide = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === "1") {
        if (r === 0 || c === 0) {
          dp[r][c] = 1;
        } else {
          dp[r][c] = 1 + Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]);
        }
        maxSide = Math.max(maxSide, dp[r][c]);
      }
    }
  }

  return maxSide * maxSide;
}
