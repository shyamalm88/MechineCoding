/**
 * ============================================================================
 * PROBLEM: Longest Substring Without Repeating Characters (LeetCode #3)
 * ============================================================================
 * Given a string s, find the length of the longest substring without repeating
 * characters.
 *
 * Example 1:
 * Input: s = "abcabcbb"
 * Output: 3
 * Explanation: The answer is "abc", with the length of 3.
 *
 * Example 2:
 * Input: s = "bbbbb"
 * Output: 1
 * Explanation: The answer is "b", with the length of 1.
 *
 * Constraints:
 * - 0 <= s.length <= 5 * 10^4
 * - s consists of English letters, digits, symbols and spaces.
 */

// ============================================================================
// APPROACH: Sliding Window (Dynamic)
// ============================================================================
/**
 * INTUITION:
 * We maintain a window [left, right] that contains only unique characters.
 * We expand `right`. If s[right] is already in our set, it means we have a duplicate.
 * We shrink from `left` until the duplicate is removed.
 *
 * Time Complexity: O(N) - Each character is added and removed at most once.
 * Space Complexity: O(min(N, A)) - Where A is the alphabet size (set size).
 */
const lengthOfLongestSubstring = (s) => {
  let left = 0;
  let maxLength = 0;
  const seen = new Set();

  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      // Duplicate found! Shrink window from the left until s[right] is removed.
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Longest Substring Without Repeating Characters Tests ===\n");

console.log("Test 1:", lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log("Test 2:", lengthOfLongestSubstring("bbbbb")); // Expected: 1
console.log("Test 3:", lengthOfLongestSubstring("pwwkew")); // Expected: 3

module.exports = { lengthOfLongestSubstring };
