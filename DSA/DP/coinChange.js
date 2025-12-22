const coinChange = (coins, amount) => {
  const memo = {};

  const dfs = (rem) => {
    if (rem === 0) return 0;
    if (rem < 0) return -1;

    if (memo[rem] !== undefined) return memo[rem];

    let min = Infinity;

    for (let coin of coins) {
      const res = dfs(rem - coin);
      if (res >= 0) {
        min = Math.min(min, res + 1);
      }
    }

    memo[rem] = min === Infinity ? -1 : min;
    return memo[rem];
  };

  return dfs(amount);
};
