/**
 * ============================================================================
 * PROBLEM: Valid Anagram (LeetCode #242)
 * ============================================================================
 * Given two strings s and t, return true if t is an anagram of s, and false otherwise.
 *
 * An Anagram is a word or phrase formed by rearranging the letters of a
 * different word or phrase, typically using all the original letters exactly once.
 *
 * Example 1:
 * Input: s = "anagram", t = "nagaram"
 * Output: true
 *
 * Example 2:
 * Input: s = "rat", t = "car"
 * Output: false
 *
 * Constraints:
 * - 1 <= s.length, t.length <= 5 * 10^4
 * - s and t consist of lowercase English letters.
 */

// ============================================================================
// APPROACH: Frequency Counter
// ============================================================================
/**
 * INTUITION:
 * If two strings are anagrams, they must have the same length and the exact
 * same count of every character.
 * We can use a frequency array of size 26 (for lowercase English letters).
 * Increment for string `s`, decrement for string `t`.
 * If the array is all zeros at the end, they are anagrams.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1) (Fixed size array of 26)
 */
const isAnagram = (s, t) => {
  if (s.length !== t.length) return false;

  const count = new Array(26).fill(0);
  const base = "a".charCodeAt(0);

  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - base]++;
    count[t.charCodeAt(i) - base]--;
  }

  // Check if all counts are zero
  return count.every((c) => c === 0);
};

console.log("=== Valid Anagram Tests ===\n");
console.log("Test 1:", isAnagram("anagram", "nagaram")); // Expected: true
console.log("Test 2:", isAnagram("rat", "car")); // Expected: false

module.exports = { isAnagram };
