function change(amount, coins) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;

  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] += dp[x - coin];
    }
  }

  return dp[amount];
}
