const wordBreak = (s, wordDict) => {
  const wordSet = new Set(wordDict);
  const memo = new Map();

  const dfs = (start) => {
    if (start === s.length) return true;
    if (memo.has(start)) return memo.get(start);

    for (let end = start + 1; end <= s.length; end++) {
      const word = s.slice(start, end);

      if (wordSet.has(word) && dfs(end)) {
        memo.set(start, true);
        return true;
      }
    }

    memo.set(start, false);
    return false;
  };

  return dfs(0);
};
