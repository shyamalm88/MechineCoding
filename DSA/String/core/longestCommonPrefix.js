/**
 * ============================================================================
 * PROBLEM: Longest Common Prefix (LeetCode #14)
 * ============================================================================
 * Write a function to find the longest common prefix string amongst an array of strings.
 * If there is no common prefix, return an empty string "".
 *
 * Example 1:
 * Input: strs = ["flower","flow","flight"]
 * Output: "fl"
 *
 * Example 2:
 * Input: strs = ["dog","racecar","car"]
 * Output: ""
 *
 * Constraints:
 * - 1 <= strs.length <= 200
 * - 0 <= strs[i].length <= 200
 * - strs[i] consists of only lowercase English letters.
 */

// ============================================================================
// APPROACH: Vertical Scanning
// ============================================================================
/**
 * INTUITION:
 * We iterate through the characters of the first string (column by column).
 * For each character, we check if it exists in the same position in all other strings.
 * If we find a mismatch or reach the end of a shorter string, we stop.
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings.
 * Space Complexity: O(1) (ignoring result storage).
 */
const longestCommonPrefix = (strs) => {
  if (strs.length === 0) return "";
  let prefix = "";

  // Iterate through the characters of the first string
  for (let i = 0; i < strs[0].length; i++) {
    let char = strs[0][i];
    // Check if this character exists at index 'i' in ALL other strings
    if (strs.every((str) => str[i] === char)) {
      prefix += char;
    } else {
      // Mismatch found, stop immediately
      break;
    }
  }
  return prefix;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Longest Common Prefix Tests ===\n");

console.log("Test 1:", longestCommonPrefix(["flower", "flow", "flight"])); // Expected: "fl"
console.log("Test 2:", longestCommonPrefix(["dog", "racecar", "car"])); // Expected: ""
console.log("Test 3:", longestCommonPrefix(["ab", "a"])); // Expected: "a"
