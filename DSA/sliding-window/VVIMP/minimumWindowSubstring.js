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
 * 1. We use two frequency maps: `need` (for t) and `window` (for current window in s).
 * 2. We track `formed`: the number of *unique* characters in `t` that are fully satisfied in the current window.
 *    - `required` is the total number of unique characters in `t`.
 * 3. Expand `right` to add characters. If a character's frequency in `window` matches `need`, increment `formed`.
 * 4. Once `formed === required` (window is valid), shrink `left` to minimize size.
 *    - If removing a character causes its frequency to drop below `need`, decrement `formed`.
 *
 * DRY RUN:
 * Input: s = "ADOBECODEBANC", t = "ABC"
 * need = {A:1, B:1, C:1}, required = 3
 *
 * 1. Expand right until valid:
 *    - r=0 ('A'): window={A:1}. Matches need. formed=1.
 *    - ...
 *    - r=5 ('C'): window={..., C:1}. Matches need. formed=2.
 *    - ...
 *    - r=9 ('B'): window={..., B:1}. Matches need. formed=3.
 *    - Window: "ADOBECODEB" (indices 0-9). Valid.
 *
 * 2. Shrink left while valid (formed === 3):
 *    - l=0 ('A'): Remove 'A'. window={A:0}. formed becomes 2.
 *    - Record minLen=10 ("ADOBECODEB").
 *    - Move l to 1. Window invalid.
 *
 * 3. Continue Expand & Shrink:
 *    - r=10 ('A'): window={A:1}. formed=3. Valid. Shrink l=1..5. Record minLen=6 ("CODEBA").
 *    - r=12 ('C'): window={C:1}. formed=3. Valid. Shrink l=... Record minLen=4 ("BANC").
 *
 * Result: "BANC"
 *
 * Time Complexity: O(S + T) - Each char in s is added and removed at most once.
 * Space Complexity: O(1) - Map size is bounded by alphabet size (e.g., 128 ASCII).
 */
const minWindow = (s, t) => {
  if (t.length > s.length) return "";

  const need = new Map();
  for (const ch of t) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }

  const window = new Map();
  let formed = 0;
  const required = need.size;

  let left = 0;
  let minLen = Infinity;
  let start = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    window.set(ch, (window.get(ch) || 0) + 1);

    if (need.has(ch) && window.get(ch) === need.get(ch)) {
      formed++;
    }

    // shrink window while it's valid
    while (formed === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }

      const leftChar = s[left];
      window.set(leftChar, window.get(leftChar) - 1);

      if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) {
        formed--;
      }

      left++;
    }
  }

  return minLen === Infinity ? "" : s.slice(start, start + minLen);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Minimum Window Substring Tests ===\n");

console.log("Test 1:", minWindow("ADOBECODEBANC", "ABC")); // Expected: "BANC"
console.log("Test 2:", minWindow("a", "a")); // Expected: "a"
console.log("Test 3:", minWindow("a", "aa")); // Expected: ""

module.exports = { minWindow };
