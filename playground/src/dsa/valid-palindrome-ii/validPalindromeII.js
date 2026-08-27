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
      // Mismatch found! Try deleting the character at 'left' OR 'right'.
      // If either resulting substring is a palindrome, return true.
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
