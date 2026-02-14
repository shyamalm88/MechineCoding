/**
 * ============================================================================
 * PROBLEM: Longest Common Subsequence (LeetCode #1143)
 * ============================================================================
 * Given two strings text1 and text2, return the length of their longest
 * common subsequence. If there is no common subsequence, return 0.
 *
 * A subsequence of a string is a new string generated from the original string
 * with some characters (can be none) deleted without changing the relative order
 * of the remaining characters.
 *
 * Example 1:
 * Input: text1 = "abcde", text2 = "ace"
 * Output: 3
 * Explanation: The longest common subsequence is "ace" and its length is 3.
 *
 * Example 2:
 * Input: text1 = "abc", text2 = "def"
 * Output: 0
 *
 * Constraints:
 * - 1 <= text1.length, text2.length <= 1000
 * - text1 and text2 consist of only lowercase English characters.
 */

// ============================================================================
// APPROACH: 2D Dynamic Programming
// ============================================================================
/**
 * INTUITION:
 * We compare text1[i] and text2[j].
 * - If characters match: The LCS length increases by 1 plus whatever the LCS was
 *   without these characters (diagonal: dp[i-1][j-1]).
 * - If they don't match: We can't include both. We take the best result from
 *   either ignoring the character from text1 (up: dp[i-1][j]) or ignoring the
 *   character from text2 (left: dp[i][j-1]).
 *
 * Time Complexity: O(M * N)
 * Space Complexity: O(M * N)
 */
const longestCommonSubsequence = (text1, text2) => {
  const m = text1.length;
  const n = text2.length;

  // Create (m+1) x (n+1) grid filled with 0
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // If characters match (note: string index is 0-based, dp is 1-based)
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        // If no match, take max of excluding char from text1 or text2
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Longest Common Subsequence Tests ===\n");

console.log("Test 1:", longestCommonSubsequence("abcde", "ace")); // Expected: 3
console.log("Test 2:", longestCommonSubsequence("abc", "abc")); // Expected: 3
console.log("Test 3:", longestCommonSubsequence("abc", "def")); // Expected: 0

module.exports = { longestCommonSubsequence };
