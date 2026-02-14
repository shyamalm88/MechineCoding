/**
 * ============================================================================
 * PROBLEM: Distinct Subsequences (LeetCode #115)
 * CATEGORY: 🔴 VVIMP (Counting DP on Subsequences)
 * ============================================================================
 *
 * You are given two strings:
 * - s (source string)
 * - t (target string)
 *
 * Return the number of DISTINCT subsequences of s
 * which equal t.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   s = "rabbbit"
 *   t = "rabbit"
 *
 *   Output: 3
 *
 *   Explanation:
 *   The three ways are:
 *     r a b b b i t
 *     r a b b b i t
 *     r a b b b i t
 *        ^ ^   ^
 *
 * Example 2:
 *
 *   s = "babgbag"
 *   t = "bag"
 *
 *   Output: 5
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= s.length, t.length <= 1000
 *
 * ============================================================================
 * INTUITION: What Are We REALLY Counting?
 * ============================================================================
 *
 * We are NOT finding substrings.
 * We are counting subsequences.
 *
 * Key Insight (CRITICAL):
 *
 *   Every character in s gives us a CHOICE:
 *     - use it
 *     - or skip it
 *
 * But:
 *   - We must preserve order
 *   - We must match ALL characters of t
 *
 * This is a PREFIX-ALIGNMENT problem.
 *
 * ============================================================================
 * DP STATE DEFINITION
 * ============================================================================
 *
 * Let:
 *   dp[i][j] = number of ways
 *              to form t[0..j-1]
 *              from s[0..i-1]
 *
 * Meaning:
 * - Use first i chars of s
 * - To form first j chars of t
 *
 * Goal:
 *   dp[m][n]
 *
 * ============================================================================
 * BASE CASES (VERY IMPORTANT)
 * ============================================================================
 *
 * dp[i][0] = 1   for all i
 *
 * Why?
 * - There is EXACTLY ONE way to form empty string t:
 *   → choose nothing
 *
 * dp[0][j] = 0   for j > 0
 *
 * Why?
 * - You cannot form non-empty t from empty s
 *
 * ============================================================================
 * DP TRANSITION (THE HEART OF THE PROBLEM)
 * ============================================================================
 *
 * Consider:
 *   s[i-1] and t[j-1]
 *
 * Case 1: s[i-1] === t[j-1]
 *
 *   We have TWO choices:
 *
 *   1️⃣ Use this character:
 *       dp[i-1][j-1]
 *
 *   2️⃣ Skip this character:
 *       dp[i-1][j]
 *
 *   dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
 *
 * Case 2: s[i-1] !== t[j-1]
 *
 *   We CANNOT use this character.
 *
 *   dp[i][j] = dp[i-1][j]
 *
 * ============================================================================
 * MENTAL MODEL
 * ============================================================================
 *
 * Think like this:
 *
 *   “At position i in s,
 *    how many ways can I complete t?”
 *
 * If characters match → branching.
 * If not → forced skip.
 *
 * ============================================================================
 * ORDER OF COMPUTATION
 * ============================================================================
 *
 * dp[i][j] depends on:
 * - dp[i-1][j]
 * - dp[i-1][j-1]
 *
 * So:
 * - Compute row by row
 * - Left to right
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * 1. Create dp table of size (m+1) × (n+1)
 * 2. Initialize base cases
 * 3. Fill dp table using transitions
 * 4. Return dp[m][n]
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - m = s.length
 * - n = t.length
 *
 * Time:  O(m × n)
 * Space: O(m × n)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔴 VVIMP
 * ============================================================================
 *
 * Interviewers are testing:
 * - Can you count without duplicates?
 * - Do you understand prefix DP?
 * - Can you explain branching clearly?
 *
 * This problem appears in MANY disguised forms.
 * ============================================================================
 */

function numDistinct(s, t) {
  const m = s.length;
  const n = t.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Base case: empty t
  for (let i = 0; i <= m; i++) {
    dp[i][0] = 1;
  }

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  return dp[m][n];
}
