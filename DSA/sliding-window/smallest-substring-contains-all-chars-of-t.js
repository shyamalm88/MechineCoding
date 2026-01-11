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
 * Implementation Details:
 * - We use a single frequency map (`need`) initialized with counts from `t`.
 * - We maintain a `missing` counter for the total number of characters from `t` still needed in the window.
 * - When `missing` reaches 0, we try to shrink the window from the left.
 *
 * Time Complexity: O(S + T) - Each char in s is added and removed at most once.
 * Space Complexity: O(1) - Map size is bounded by alphabet size (e.g., 128 ASCII).
 */
const minWindow = (s, t) => {
  // 1. Build frequency map for target string t
  const need = new Map();
  for (const c of t) {
    need.set(c, (need.get(c) || 0) + 1);
  }

  // 2. Initialize pointers and tracking variables
  let missing = t.length;
  let left = 0;
  let bestLen = Infinity;
  let bestStart = 0;

  // 3. Expand the window by moving 'right'
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];

    // If current char is in t, decrement its count in 'need'
    // If count > 0, it means this char contributes to satisfying t
    if (need.has(ch)) {
      if (need.get(ch) > 0) missing--;
      need.set(ch, need.get(ch) - 1); // Can go negative (indicates surplus)
    }

    // 4. Shrink window from 'left' while it remains valid (missing === 0)
    while (missing === 0) {
      // Update minimum window found so far
      if (right - left + 1 < bestLen) {
        bestLen = right - left + 1;
        bestStart = left;
      }

      // Try to remove the leftmost character
      const leftChar = s[left];
      if (need.has(leftChar)) {
        need.set(leftChar, need.get(leftChar) + 1);
        // If count becomes > 0, we are now missing a required char
        if (need.get(leftChar) > 0) missing++;
      }
      left++; // Shrink
    }
  }

  return bestLen === Infinity
    ? ""
    : s.substring(bestStart, bestStart + bestLen);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Minimum Window Substring Tests ===\n");

console.log("Test 1:", minWindow("ADOBECODEBANC", "ABC")); // Expected: "BANC"
console.log("Test 2:", minWindow("a", "a")); // Expected: "a"
console.log("Test 3:", minWindow("a", "aa")); // Expected: ""

module.exports = { minWindow };
