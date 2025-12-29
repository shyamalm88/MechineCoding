/**
 * ============================================================================
 * PROBLEM: Generate Parentheses (LeetCode #22)
 * ============================================================================
 * Given n pairs of parentheses, write a function to generate all combinations
 * of well-formed parentheses.
 *
 * Example 1:
 * Input: n = 3
 * Output: ["((()))","(()())","(())()","()(())","()()()"]
 *
 * Example 2:
 * Input: n = 1
 * Output: ["()"]
 *
 * Constraints:
 * - 1 <= n <= 8
 */

// ============================================================================
// APPROACH: Backtracking
// ============================================================================
/**
 * INTUITION:
 * We build the string character by character. At any point, we can add:
 * 1. An opening bracket '(' if we haven't used all n opening brackets.
 * 2. A closing bracket ')' if the number of closing brackets used so far is
 *    less than the number of opening brackets (to ensure validity).
 *
 * Time Complexity: O(4^n / sqrt(n)) - Catalan number sequence.
 * Space Complexity: O(n) - Recursion stack depth.
 */
const generateParenthesis = (n) => {
  const result = [];

  const backtrack = (currentString, openCount, closeCount) => {
    // Base Case: String is complete (length == 2*n)
    if (currentString.length === 2 * n) {
      result.push(currentString);
      return;
    }

    // Decision 1: Add '(' if we still have allowance
    if (openCount < n) {
      backtrack(currentString + "(", openCount + 1, closeCount);
    }

    // Decision 2: Add ')' if it doesn't invalidate the string
    // (Must have more open brackets than closed ones so far)
    if (closeCount < openCount) {
      backtrack(currentString + ")", openCount, closeCount + 1);
    }
  };

  backtrack("", 0, 0);
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Generate Parentheses Tests ===\n");

console.log("Test 1 (n=3):", generateParenthesis(3));
// Expected: ["((()))","(()())","(())()","()(())","()()()"]

module.exports = { generateParenthesis };