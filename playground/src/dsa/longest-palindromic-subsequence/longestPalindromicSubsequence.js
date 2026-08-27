function longestPalindromeSubseq(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));

  // Base case: single characters
  for (let i = 0; i < n; i++) {
    dp[i][i] = 1;
  }

  // Fill DP table
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        dp[i][j] = 2 + dp[i + 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[0][n - 1];
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Longest Palindromic Subsequence Tests ===\n");

console.log("Test 1:", longestPalindromeSubseq("bbbab")); // Expected: 4 ("bbbb")
console.log("Test 2:", longestPalindromeSubseq("cbbd")); // Expected: 2 ("bb")
console.log("Test 3:", longestPalindromeSubseq("a")); // Expected: 1 ("a")
console.log("Test 4:", longestPalindromeSubseq("abcde")); // Expected: 1 (no repeats)

module.exports = { longestPalindromeSubseq };
