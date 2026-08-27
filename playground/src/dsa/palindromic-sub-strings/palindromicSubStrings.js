// ============================================================================
// APPROACH: Expand Around Center
// ============================================================================
/**
 * INTUITION:
 * A palindrome mirrors around its center. Therefore, we can count palindromes
 * by expanding from every possible center.
 * There are 2N - 1 centers:
 * - N centers are single characters (e.g., "aba" centered at 'b').
 * - N - 1 centers are between characters (e.g., "abba" centered between 'b's).
 *
 * We iterate through each index `i` and treat it as a center:
 * 1. Odd length palindromes: center at `i` (left=i, right=i).
 * 2. Even length palindromes: center between `i` and `i+1` (left=i, right=i+1).
 *
 * Time Complexity: O(N^2) - We expand around each center.
 * Space Complexity: O(1) - No extra space used.
 */
const palindromicSubstrings = (s) => {
  let count = 0;

  const expandAroundCenter = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;
      l--;
      r++;
    }
  };

  for (let i = 0; i < s.length; i++) {
    // Odd length palindromes
    expandAroundCenter(i, i);
    // Even length palindromes
    expandAroundCenter(i, i + 1);
  }

  return count;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Palindromic Substrings Tests ===\n");
console.log("Test 1:", palindromicSubstrings("abc")); // Expected: 3
console.log("Test 2:", palindromicSubstrings("aaa")); // Expected: 6

module.exports = { palindromicSubstrings };
