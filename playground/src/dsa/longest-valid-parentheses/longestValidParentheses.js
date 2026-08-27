// ============================================================================
// APPROACH: Stack of Indices (Track Boundary of Last Unmatched ')')
// ============================================================================
/**
 * INTUITION:
 * Push a sentinel index -1 onto the stack first - it acts as the "base"
 * boundary for the current valid run.
 *
 * - On '(': push its index. It's a potential boundary if it never gets matched.
 * - On ')':
 *   - Pop the stack (try to match it against the last '(' or boundary).
 *   - If the stack becomes empty, this ')' is unmatched, so push its index
 *     as the new boundary for future valid runs.
 *   - Otherwise, the top of the stack now points to the index just before
 *     the start of the current valid run, so the valid length is
 *     `i - stack[top]`.
 *
 * Every time we compute a valid length, update `maxLen` with the max seen.
 *
 * Time Complexity: O(N) - single pass, each index pushed/popped at most once.
 * Space Complexity: O(N) - stack can hold up to N indices in the worst case.
 */
const longestValidParentheses = (s) => {
  let maxLen = 0;
  const stack = [-1];

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
    } else {
      stack.pop();

      if (stack.length === 0) {
        // No boundary left - this ')' becomes the new base.
        stack.push(i);
      } else {
        maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
      }
    }
  }

  return maxLen;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Longest Valid Parentheses Tests ===\n");
console.log("Test 1:", longestValidParentheses("(()")); // Expected: 2
console.log("Test 2:", longestValidParentheses(")()())")); // Expected: 4
console.log("Test 3:", longestValidParentheses("")); // Expected: 0

module.exports = { longestValidParentheses };
