/**
 * ============================================================================
 * PROBLEM: Valid Parentheses (LeetCode #20)
 * ============================================================================
 * Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
 * determine if the input string is valid.
 *
 * An input string is valid if:
 * 1. Open brackets must be closed by the same type of brackets.
 * 2. Open brackets must be closed in the correct order.
 * 3. Every close bracket has a corresponding open bracket of the same type.
 *
 * Example 1:
 * Input: s = "()"
 * Output: true
 *
 * Example 2:
 * Input: s = "()[]{}"
 * Output: true
 *
 * Example 3:
 * Input: s = "(]"
 * Output: false
 */

// ============================================================================
// APPROACH: Stack
// ============================================================================
/**
 * INTUITION:
 * Use a stack to keep track of opening brackets. When a closing bracket is encountered,
 * check if it matches the most recent opening bracket (top of stack).
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
const validParenthesis = (s) => {
  const stack = [];
  // Map for easy lookup of matching brackets: Key = Open, Value = Close
  const map = {
    "(": ")",
    "{": "}",
    "[": "]",
  };

  for (let ch of s) {
    // If it's an opening bracket, push to stack
    if (ch === "(" || ch === "{" || ch === "[") {
      stack.push(ch);
    } else {
      // If it's a closing bracket:
      // 1. If stack is empty, no matching open bracket -> invalid
      if (!stack.length) return false;

      // 2. Pop the last open bracket
      const top = stack.pop();

      // 3. Check if the popped open bracket matches the current closing bracket
      // map[top] gives the expected closing bracket for the popped open bracket
      if (map[top] !== ch) return false;
    }
  }
  // If stack is empty, all brackets were matched correctly
  return stack.length === 0;
};
