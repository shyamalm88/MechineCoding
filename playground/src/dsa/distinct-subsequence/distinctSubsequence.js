function numDistinct(s, t) {
  const m = s.length;
  const n = t.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Base case: empty t
  for (let i = 0; i <= m; i++) {
    dp[i][0] = 1;
  }

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  return dp[m][n];
}
