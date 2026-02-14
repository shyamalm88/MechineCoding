/**
 * ============================================================================
 * PROBLEM: Palindromic Substrings (LeetCode #647)
 * CATEGORY: 🔴 VVIMP (DP on Substrings / Window Expansion)
 * ============================================================================
 *
 * You are given a string s.
 *
 * Return the number of PALINDROMIC SUBSTRINGS in s.
 *
 * A substring is palindromic if it reads the same forward and backward.
 *
 * NOTE:
 * - Substrings are contiguous
 * - Single characters are palindromes
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   s = "abc"
 *   Palindromes: "a", "b", "c"
 *   Output: 3
 *
 * Example 2:
 *
 *   s = "aaa"
 *   Palindromes:
 *     "a", "a", "a",
 *     "aa", "aa",
 *     "aaa"
 *   Output: 6
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= s.length <= 1000
 *
 * ============================================================================
 * INTUITION: What Are We Really Counting?
 * ============================================================================
 *
 * We are NOT finding the longest palindrome.
 * We are NOT returning substrings.
 *
 * We are simply counting:
 *   “How many substrings are palindromes?”
 *
 * Key Insight (CRITICAL):
 *
 *   A substring s[i..j] is a palindrome IF:
 *     - s[i] === s[j]
 *     - s[i+1..j-1] is also a palindrome
 *
 * This recursive structure screams DP.
 *
 * ============================================================================
 * DP STATE DEFINITION
 * ============================================================================
 *
 * Let:
 *   dp[i][j] = true if substring s[i..j] is a palindrome
 *
 * Goal:
 *   Count how many dp[i][j] are true
 *
 * ============================================================================
 * BASE CASES
 * ============================================================================
 *
 * 1️⃣ Length = 1 (single character)
 *   dp[i][i] = true
 *
 * 2️⃣ Length = 2
 *   dp[i][i+1] = (s[i] === s[i+1])
 *
 * These base cases seed the DP.
 *
 * ============================================================================
 * DP TRANSITION
 * ============================================================================
 *
 * For substrings of length ≥ 3:
 *
 *   dp[i][j] = true IF:
 *     s[i] === s[j] AND dp[i+1][j-1] === true
 *
 * Otherwise:
 *   dp[i][j] = false
 *
 * ============================================================================
 * ORDER OF COMPUTATION (THIS IS CRITICAL)
 * ============================================================================
 *
 * dp[i][j] depends on dp[i+1][j-1]
 *
 * That means:
 * - Smaller windows must be computed BEFORE larger ones
 *
 * Correct order:
 * - Iterate by substring length
 *   from 1 → n
 *
 * ============================================================================
 * MENTAL MODEL
 * ============================================================================
 *
 * Think in terms of expanding windows:
 *
 *   Start with:
 *     length = 1  → all valid
 *     length = 2  → check pairs
 *
 *   Then expand outward:
 *     length = 3
 *     length = 4
 *     ...
 *
 * If the inside is palindromic AND edges match,
 * the whole thing is palindromic.
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * 1. Initialize dp[n][n] = false
 * 2. Count = 0
 * 3. For len from 1 → n:
 *      For i from 0 → n - len:
 *         j = i + len - 1
 *         Check palindrome conditions
 *         If true:
 *           dp[i][j] = true
 *           count++
 *
 * 4. Return count
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
 * - Can you do DP over substrings?
 * - Do you understand dependency order?
 * - Can you separate base cases cleanly?
 *
 * This pattern appears in MANY string DP problems.
 * ============================================================================
 */

function countSubstrings(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(false));

  let count = 0;

  // Iterate by substring length
  for (let len = 1; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;

      if (len === 1) {
        dp[i][j] = true;
      } else if (len === 2) {
        dp[i][j] = s[i] === s[j];
      } else {
        dp[i][j] = s[i] === s[j] && dp[i + 1][j - 1];
      }

      if (dp[i][j]) count++;
    }
  }

  return count;
}
