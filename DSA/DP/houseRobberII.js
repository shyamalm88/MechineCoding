const houseRobberII = (money) => {
  const robLinear = (arr) => {
    const memo = {};

    const dfs = (i) => {
      if (i >= arr.length) return 0;
      if (memo[i] !== undefined) return memo[i];

      memo[i] = Math.max(dfs(i + 1), arr[i] + dfs(i + 2));
      return memo[i];
    };

    return dfs(0);
  };

  if (money.length === 1) return money[0];

  const case1 = robLinear(money.slice(1)); // skip first
  const case2 = robLinear(money.slice(0, -1)); // skip last

  return Math.max(case1, case2);
};
