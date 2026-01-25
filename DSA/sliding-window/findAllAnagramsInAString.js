/**
 * ============================================================================
 * PROBLEM: Find All Anagrams in a String (LeetCode #438)
 * ============================================================================
 * Given two strings s and p, return an array of all the start indices of p's
 * anagrams in s. You may return the answer in any order.
 *
 * An Anagram is a word or phrase formed by rearranging the letters of a
 * different word or phrase, typically using all the original letters exactly once.
 *
 * Example 1:
 * Input: s = "cbaebabacd", p = "abc"
 * Output: [0,6]
 * Explanation:
 * The substring with start index = 0 is "cba", which is an anagram of "abc".
 * The substring with start index = 6 is "bac", which is an anagram of "abc".
 *
 * Example 2:
 * Input: s = "abab", p = "ab"
 * Output: [0,1,2]
 *
 * Constraints:
 * - 1 <= s.length, p.length <= 3 * 10^4
 * - s and p consist of lowercase English letters.
 */

// ============================================================================
// APPROACH: Fixed Sliding Window with Frequency Map
// ============================================================================
/**
 * INTUITION:
 * We need to find substrings of length `p.length` in `s` that contain the exact
 * same character counts as `p`.
 *
 * We can use a sliding window of size `p.length`.
 * 1. Create a frequency map (`need`) for string `p`.
 * 2. Expand the window by adding `s[right]` to a `window` map.
 * 3. If the window size exceeds `p.length`, shrink it from the left.
 * 4. Instead of comparing two full maps (O(26)) every time, we track a `formed` count.
 *    - When `window[char]` reaches the count in `need[char]`, we increment `formed`.
 *    - When removing a char from the left, if it causes `window[char]` to drop below
 *      `need[char]`, we decrement `formed`.
 * 5. If `formed` equals the number of unique characters in `p`, we found an anagram.
 *
 * DRY RUN:
 * Input: s = "cbaebabacd", p = "abc"
 * need = {a:1, b:1, c:1}, required = 3
 *
 * 1. right=0 ('c'): window={c:1}. formed=1 (c is satisfied).
 * 2. right=1 ('b'): window={c:1, b:1}. formed=2 (b is satisfied).
 * 3. right=2 ('a'): window={c:1, b:1, a:1}. formed=3.
 *    - Window len is 3. formed == required. Add 0 to result.
 *
 * 4. right=3 ('e'): window={c:1, b:1, a:1, e:1}.
 *    - Window len > 3. Remove s[0] ('c').
 *    - window['c'] becomes 0. It was needed, so formed-- (now 2).
 *    - formed != required.
 *
 * Time Complexity: O(N) - N is length of s.
 * Space Complexity: O(1) - Map size is bounded by 26 lowercase letters.
 */
const findAnagrams = (s, p) => {
  const result = [];
  if (s.length < p.length) return result;

  const need = new Map();
  for (const ch of p) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }

  const window = new Map();
  let formed = 0;
  const required = need.size;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    window.set(ch, (window.get(ch) || 0) + 1);

    if (need.has(ch) && window.get(ch) === need.get(ch)) {
      formed++;
    }

    if (right - left + 1 > p.length) {
      const leftChar = s[left];
      // If the character leaving the window was part of the pattern
      // and its count matched exactly what was needed, we are losing a match.
      // (e.g., needed 2 'a's, had 2 'a's, now removing one -> have 1 'a', match lost)
      if (need.has(leftChar) && window.get(leftChar) === need.get(leftChar)) {
        formed--;
      }

      window.set(leftChar, window.get(leftChar) - 1);
      if (window.get(leftChar) === 0) {
        window.delete(leftChar);
      }
      left++;
    }

    if (formed === required) {
      result.push(left);
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Find All Anagrams Tests ===\n");

console.log("Test 1:", findAnagrams("cbaebabacd", "abc")); // Expected: [0, 6]
console.log("Test 2:", findAnagrams("abab", "ab")); // Expected: [0, 1, 2]
console.log("Test 3:", findAnagrams("af", "be")); // Expected: []

module.exports = { findAnagrams };
