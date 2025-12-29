/**
 * ============================================================================
 * PROBLEM: Minimum Window Substring (LeetCode #76)
 * ============================================================================
 * Given two strings s and t of lengths m and n respectively, return the minimum
 * window substring of s such that every character in t (including duplicates)
 * is included in the window. If there is no such substring, return the empty string "".
 *
 * Example 1:
 * Input: s = "ADOBECODEBANC", t = "ABC"
 * Output: "BANC"
 * Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.
 *
 * Example 2:
 * Input: s = "a", t = "a"
 * Output: "a"
 *
 * Constraints:
 * - m == s.length, n == t.length
 * - 1 <= m, n <= 10^5
 */

// ============================================================================
// APPROACH: Sliding Window (Expand & Shrink)
// ============================================================================
/**
 * INTUITION:
 * 1. Expand `right` to find a valid window (contains all chars of t).
 * 2. Once valid, shrink `left` to minimize the window size while keeping it valid.
 * 3. Track the minimum length found.
 *
 * We use a `need` map for counts of T, and a `windowMap` for counts in current window.
 * `formed` tracks how many unique characters have met the required frequency.
 *
 * Time Complexity: O(S + T)
 * Space Complexity: O(1) (since alphabet size is limited to 52/128 chars)
 */
const minWindow = (s, t) => {
  if (t.length > s.length) return "";

  // 1. Frequency map for T
  const need = new Map();
  for (const ch of t) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }

  const windowMap = new Map();
  let left = 0;
  let right = 0;
  let formed = 0;
  const required = need.size;

  // Result tuple: [length, left, right]
  // Initialized to -1 length to indicate no result found yet
  let ans = [-1, 0, 0];

  while (right < s.length) {
    const charRight = s[right];
    windowMap.set(charRight, (windowMap.get(charRight) || 0) + 1);

    // If current char matches the requirement count in T, increment formed
    if (
      need.has(charRight) &&
      windowMap.get(charRight) === need.get(charRight)
    ) {
      formed++;
    }

    // Try to shrink the window while it remains valid
    while (left <= right && formed === required) {
      const currentLen = right - left + 1;

      // Update smallest window if current is smaller
      if (ans[0] === -1 || currentLen < ans[0]) {
        ans = [currentLen, left, right];
      }

      // Remove left character
      const charLeft = s[left];
      windowMap.set(charLeft, (windowMap.get(charLeft) || 0) - 1);

      // If removing this char breaks the requirement, decrement formed
      if (need.has(charLeft) && windowMap.get(charLeft) < need.get(charLeft)) {
        formed--;
      }
      left++;
    }
    right++;
  }

  return ans[0] === -1 ? "" : s.substring(ans[1], ans[2] + 1);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Minimum Window Substring Tests ===\n");

console.log("Test 1:", minWindow("ADOBECODEBANC", "ABC")); // Expected: "BANC"
console.log("Test 2:", minWindow("a", "a")); // Expected: "a"
console.log("Test 3:", minWindow("a", "aa")); // Expected: ""

module.exports = { minWindow };
