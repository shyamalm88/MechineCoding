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
