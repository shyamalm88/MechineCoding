const houseRobber1 = (money) => {
  const memo = {};

  const dfs = (i) => {
    if (i >= money.length) return 0;
    if (memo[i] !== undefined) return memo[i];

    memo[i] = Math.max(dfs(i + 1), money[i] + dfs(i + 2));

    return memo[i];
  };

  return dfs(0);
};
