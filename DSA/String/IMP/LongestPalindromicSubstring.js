/**
 * ============================================================================
 * PROBLEM: Longest Palindromic Substring (LeetCode #5)
 * ============================================================================
 * Given a string s, return the longest palindromic substring in s.
 *
 * Example 1:
 * Input: s = "babad"
 * Output: "bab" (or "aba")
 *
 * Example 2:
 * Input: s = "cbbd"
 * Output: "bb"
 *
 * Constraints:
 * - 1 <= s.length <= 1000
 */

// ============================================================================
// APPROACH: Expand Around Center
// ============================================================================
/**
 * INTUITION:
 * A palindrome mirrors around its center. Therefore, a palindrome can be
 * expanded from its center.
 * There are 2N - 1 centers (N single character centers, N-1 between-character centers).
 * We iterate through each possible center and expand outwards.
 *
 * Time Complexity: O(N^2)
 * Space Complexity: O(1)
 */
const expandAroundCenter = (string, left, right) => {
  // Expand outwards as long as characters match and we are within bounds
  while (left >= 0 && right < string.length && string[left] === string[right]) {
    left--;
    right++;
  }
  return string.slice(left + 1, right);
};

const longestPalindrome = (string) => {
  let longest = "";

  for (let i = 0; i < string.length; i++) {
    // Case 1: Odd length palindrome (center is a single character)
    const odd = expandAroundCenter(string, i, i);
    // Case 2: Even length palindrome (center is between two characters)
    const even = expandAroundCenter(string, i, i + 1);

    if (odd.length > longest.length) longest = odd;
    if (even.length > longest.length) longest = even;
  }

  return longest;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Longest Palindromic Substring Tests ===\n");

console.log("Test 1:", longestPalindrome("babad")); // Expected: "bab" or "aba"
console.log("Test 2:", longestPalindrome("cbbd")); // Expected: "bb"
