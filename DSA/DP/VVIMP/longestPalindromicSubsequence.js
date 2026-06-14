/**
 * ============================================================================
 * PROBLEM: Longest Palindromic Subsequence (LeetCode #516)
 * CATEGORY: 🔴 VVIMP (Subsequence DP on Strings)
 * ============================================================================
 *
 * You are given a string s.
 *
 * Return the LENGTH of the LONGEST palindromic SUBSEQUENCE in s.
 *
 * NOTE:
 * - Subsequence does NOT need to be contiguous
 * - Characters must remain in order
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   s = "bbbab"
 *
 *   Longest Palindromic Subsequence:
 *     "bbbb"
 *
 *   Output: 4
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= s.length <= 1000
 *
 * ============================================================================
 * INTUITION: Substring vs Subsequence (CRITICAL)
 * ============================================================================
 *
 * Substring:
 *   - contiguous
 *   - window expansion works
 *
 * Subsequence:
 *   - gaps allowed
 *   - window expansion FAILS
 *
 * Key Insight (VERY IMPORTANT):
 *
 *   When characters at both ends match,
 *   we WANT to include them.
 *
 *   When they don’t,
 *   we must SKIP something.
 *
 * ============================================================================
 * DP STATE DEFINITION
 * ============================================================================
 *
 * Let:
 *   dp[i][j] = length of the longest palindromic subsequence
 *              in s[i..j]
 *
 * Goal:
 *   dp[0][n-1]
 *
 * ============================================================================
 * BASE CASES
 * ============================================================================
 *
 * i === j:
 *   dp[i][j] = 1   (single character)
 *
 * i > j:
 *   dp[i][j] = 0   (empty substring)
 *
 * ============================================================================
 * DP TRANSITION
 * ============================================================================
 *
 * If s[i] === s[j]:
 *
 *   dp[i][j] = 2 + dp[i+1][j-1]
 *
 * Else:
 *
 *   dp[i][j] = max(
 *     dp[i+1][j],   // skip left
 *     dp[i][j-1]    // skip right
 *   )
 *
 * Interpretation:
 * - When ends match → take both
 * - When ends don’t → best of skipping one side
 *
 * ============================================================================
 * ORDER OF COMPUTATION (CRITICAL)
 * ============================================================================
 *
 * dp[i][j] depends on:
 * - dp[i+1][j]
 * - dp[i][j-1]
 * - dp[i+1][j-1]
 *
 * Therefore:
 * - Compute shorter substrings FIRST
 *
 * Correct order:
 * - i from n-1 → 0
 * - j from i+1 → n-1
 *
 * ============================================================================
 * MENTAL MODEL
 * ============================================================================
 *
 * Think like:
 *
 *   “For substring s[i..j],
 *    what is the best palindrome I can build?”
 *
 * If ends match → great.
 * If not → drop one end.
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * 1. Create dp[n][n]
 * 2. Initialize dp[i][i] = 1
 * 3. Fill table using correct order
 * 4. Return dp[0][n-1]
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Time:  O(n²)
 * Space: O(n²)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔴 VVIMP
 * ============================================================================
 *
 * Interviewers are testing:
 * - Do you understand subsequence DP?
 * - Can you explain why skipping works?
 * - Do you respect DP dependency order?
 *
 * This problem is a DP CLASSIC.
 * ============================================================================
 */

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
