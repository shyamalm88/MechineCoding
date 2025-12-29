/**
 * ============================================================================
 * PROBLEM: Valid Palindrome (LeetCode #125)
 * ============================================================================
 * A phrase is a palindrome if, after converting all uppercase letters into
 * lowercase letters and removing all non-alphanumeric characters, it reads
 * the same forward and backward. Alphanumeric characters include letters and numbers.
 *
 * Given a string s, return true if it is a palindrome, or false otherwise.
 *
 * Example 1:
 * Input: s = "A man, a plan, a canal: Panama"
 * Output: true
 * Explanation: "amanaplanacanalpanama" is a palindrome.
 *
 * Example 2:
 * Input: s = "race a car"
 * Output: false
 * Explanation: "raceacar" is not a palindrome.
 *
 * Constraints:
 * - 1 <= s.length <= 2 * 10^5
 * - s consists only of printable ASCII characters.
 */

// ============================================================================
// APPROACH: Two Pointers
// ============================================================================
/**
 * INTUITION:
 * We need to ignore non-alphanumeric characters and case.
 * 1. Clean the string: Remove non-alphanumeric chars using Regex and convert to lowercase.
 * 2. Use Two Pointers (start and end) to compare characters moving inward.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N) (if creating a new string) or O(1) (if traversing raw string).
 * Here we create a new string for simplicity, which is O(N).
 */
const isPalindrome = (s) => {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleanStr = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  let left = 0;
  let right = cleanStr.length - 1;

  while (left < right) {
    if (cleanStr[left] !== cleanStr[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
};

console.log("=== Valid Palindrome Tests ===\n");
console.log("Test 1:", isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log("Test 2:", isPalindrome("race a car")); // Expected: false

module.exports = { isPalindrome };
