/**
 * ============================================================================
 * PROBLEM: Decode Ways (LeetCode #91)
 * ============================================================================
 * A message containing letters from A-Z can be encoded into numbers using the
 * following mapping:
 * 'A' -> "1", 'B' -> "2", ... 'Z' -> "26"
 *
 * To decode an encoded message, all the digits must be grouped then mapped back
 * into letters using the reverse of the mapping above (there may be multiple ways).
 * For example, "11106" can be mapped into:
 * "AAJF" with the grouping (1 1 10 6)
 * "KJF" with the grouping (11 10 6)
 *
 * Given a string s containing only digits, return the number of ways to decode it.
 *
 * Example 1:
 * Input: s = "12"
 * Output: 2
 * Explanation: "12" could be decoded as "AB" (1 2) or "L" (12).
 *
 * Example 2:
 * Input: s = "226"
 * Output: 3
 * Explanation: "226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).
 *
 * Constraints:
 * - 1 <= s.length <= 100
 * - s contains only digits and may contain leading zero(s).
 */

// ============================================================================
// APPROACH: Dynamic Programming (Top-Down)
// ============================================================================
/**
 * INTUITION:
 * At index `i`, we can:
 * 1. Take 1 digit: Valid if s[i] != '0'. Recurse on i+1.
 * 2. Take 2 digits: Valid if s[i...i+1] is between "10" and "26". Recurse on i+2.
 * Sum the ways from both valid choices.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
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

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Decode Ways Tests ===\n");

console.log("Test 1:", numDecodings("12")); // Expected: 2
console.log("Test 2:", numDecodings("226")); // Expected: 3
console.log("Test 3:", numDecodings("06")); // Expected: 0

module.exports = { numDecodings };
