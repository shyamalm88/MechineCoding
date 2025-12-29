/**
 * ============================================================================
 * PROBLEM: Permutation in String (LeetCode #567)
 * ============================================================================
 * Given two strings s1 and s2, return true if s2 contains a permutation of s1,
 * or false otherwise.
 *
 * In other words, return true if one of s1's permutations is the substring of s2.
 *
 * Example 1:
 * Input: s1 = "ab", s2 = "eidbaooo"
 * Output: true
 * Explanation: s2 contains one permutation of s1 ("ba").
 *
 * Example 2:
 * Input: s1 = "ab", s2 = "eidboaoo"
 * Output: false
 *
 * Constraints:
 * - 1 <= s1.length, s2.length <= 10^4
 * - s1 and s2 consist of lowercase English letters.
 */

// ============================================================================
// APPROACH: Fixed Sliding Window
// ============================================================================
/**
 * INTUITION:
 * We need to find a substring in s2 of length `s1.length` that has the exact
 * same character counts as s1.
 * We maintain a window of size `s1.length` on s2.
 * We compare the frequency arrays (or maps) of s1 and the current window in s2.
 *
 * Time Complexity: O(N) where N is length of s2.
 * Space Complexity: O(1) (Array of size 26).
 */
const checkInclusion = (s1, s2) => {
  if (s1.length > s2.length) return false;

  const s1Count = new Array(26).fill(0);
  const s2Count = new Array(26).fill(0);
  const aCode = "a".charCodeAt(0);

  // Initialize first window
  for (let i = 0; i < s1.length; i++) {
    s1Count[s1.charCodeAt(i) - aCode]++;
    s2Count[s2.charCodeAt(i) - aCode]++;
  }

  const matches = () => {
    for (let i = 0; i < 26; i++) {
      if (s1Count[i] !== s2Count[i]) return false;
    }
    return true;
  };

  if (matches()) return true;

  // Slide the window
  for (let i = s1.length; i < s2.length; i++) {
    // Add new char
    s2Count[s2.charCodeAt(i) - aCode]++;
    // Remove old char
    s2Count[s2.charCodeAt(i - s1.length) - aCode]--;

    if (matches()) return true;
  }

  return false;
};

console.log("=== Permutation in String Tests ===\n");
console.log("Test 1:", checkInclusion("ab", "eidbaooo")); // Expected: true
console.log("Test 2:", checkInclusion("ab", "eidboaoo")); // Expected: false

module.exports = { checkInclusion };
