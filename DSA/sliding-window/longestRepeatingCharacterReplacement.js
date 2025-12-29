/**
 * ============================================================================
 * PROBLEM: Longest Repeating Character Replacement (LeetCode #424)
 * ============================================================================
 * You are given a string s and an integer k. You can choose any character of
 * the string and change it to any other uppercase English character.
 * You can perform this operation at most k times.
 *
 * Return the length of the longest substring containing the same letter you
 * can get after performing the above operations.
 *
 * Example 1:
 * Input: s = "ABAB", k = 2
 * Output: 4
 * Explanation: Replace the two 'A's with two 'B's or vice versa.
 *
 * Example 2:
 * Input: s = "AABABBA", k = 1
 * Output: 4
 * Explanation: Replace the one 'A' in the middle with 'B' and form "AABBBBA".
 * The substring "BBBB" has the longest repeating letters, which is 4.
 *
 * Constraints:
 * - 1 <= s.length <= 10^5
 * - s consists of only uppercase English letters.
 */

// ============================================================================
// APPROACH: Sliding Window (Frequency Count)
// ============================================================================
/**
 * INTUITION:
 * In any window [left, right], we want to make all characters match the
 * "most frequent character" in that window.
 * The number of replacements needed = (Window Length) - (Count of Most Frequent Char).
 *
 * If (Length - MaxFreq) <= k, the window is valid.
 * If (Length - MaxFreq) > k, the window is invalid, so we shrink from left.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(26) -> O(1)
 */
const characterReplacement = (s, k) => {
  const count = new Map();
  let left = 0;
  let maxFreq = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    count.set(char, (count.get(char) || 0) + 1);
    maxFreq = Math.max(maxFreq, count.get(char));

    // Window Length = right - left + 1
    // If replacements needed > k, shrink window
    if (right - left + 1 - maxFreq > k) {
      count.set(s[left], count.get(s[left]) - 1);
      left++;
    }

    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
};

console.log("=== Longest Repeating Character Replacement Tests ===\n");
console.log("Test 1:", characterReplacement("ABAB", 2)); // Expected: 4
console.log("Test 2:", characterReplacement("AABABBA", 1)); // Expected: 4

module.exports = { characterReplacement };
