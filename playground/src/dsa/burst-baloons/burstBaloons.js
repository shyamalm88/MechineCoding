function maxCoins(nums) {
  // Pad with 1s
  const arr = [1, ...nums, 1];
  const n = arr.length;

  const dp = Array.from({ length: n }, () => Array(n).fill(0));

  // length is the distance between i and j
  for (let len = 2; len < n; len++) {
    for (let i = 0; i + len < n; i++) {
      const j = i + len;

      for (let k = i + 1; k < j; k++) {
        dp[i][j] = Math.max(
          dp[i][j],
          dp[i][k] + arr[i] * arr[k] * arr[j] + dp[k][j],
        );
      }
    }
  }

  return dp[0][n - 1];
}
