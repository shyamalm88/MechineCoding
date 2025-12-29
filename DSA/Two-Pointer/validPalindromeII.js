/**
 * ============================================================================
 * PROBLEM: Valid Palindrome II (LeetCode #680)
 * ============================================================================
 * Given a string s, return true if the s can be palindrome after deleting at
 * most one character from it.
 *
 * Example 1:
 * Input: s = "aba"
 * Output: true
 *
 * Example 2:
 * Input: s = "abca"
 * Output: true
 * Explanation: You could delete the character 'c'.
 *
 * Example 3:
 * Input: s = "abc"
 * Output: false
 *
 * Constraints:
 * - 1 <= s.length <= 10^5
 * - s consists of lowercase English letters.
 */

// ============================================================================
// APPROACH: Two Pointers (Greedy with One Skip)
// ============================================================================
/**
 * INTUITION:
 * We use standard two pointers (left, right) to check for a palindrome.
 * If s[left] === s[right], we continue moving inward.
 *
 * If s[left] !== s[right], we have a mismatch. We are allowed ONE deletion.
 * We have two choices:
 * 1. Delete character at `left` (check if substring s[left+1...right] is palindrome).
 * 2. Delete character at `right` (check if substring s[left...right-1] is palindrome).
 *
 * If either of those substrings is a valid palindrome, return true.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
const validPalindrome = (s) => {
  const isPalindromeRange = (str, l, r) => {
    while (l < r) {
      if (str[l] !== str[r]) return false;
      l++;
      r--;
    }
    return true;
  };

  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) {
      // Try skipping left OR skipping right
      return (
        isPalindromeRange(s, left + 1, right) ||
        isPalindromeRange(s, left, right - 1)
      );
    }
    left++;
    right--;
  }

  return true;
};

console.log("=== Valid Palindrome II Tests ===\n");
console.log("Test 1:", validPalindrome("abca")); // Expected: true
console.log("Test 2:", validPalindrome("abc")); // Expected: false

module.exports = { validPalindrome };
