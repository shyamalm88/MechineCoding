const numDecodings = (s) => {
  const memo = {};

  const dfs = (i) => {
    // reached end → one valid decoding
    if (i === s.length) return 1;

    // cannot decode a string starting with '0'
    if (s[i] === "0") return 0;

    // memo hit
    if (memo[i] !== undefined) return memo[i];

    // take one digit
    let ways = dfs(i + 1);

    // take two digits if valid
    if (i + 1 < s.length) {
      const num = Number(s.slice(i, i + 2));
      if (num >= 10 && num <= 26) {
        ways += dfs(i + 2);
      }
    }

    memo[i] = ways;
    return ways;
  };

  return dfs(0);
};
