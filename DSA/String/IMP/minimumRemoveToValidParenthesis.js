/**
 * PROBLEM: Minimum Remove to Make Valid Parentheses (LeetCode #1249)
 *
 * Intuition:
 * To make the parentheses valid with minimum removals, we need to identify
 * unmatched '(' and unmatched ')'.
 *
 * 1. We can use a stack to keep track of the indices of open parentheses '('.
 * 2. We iterate through the string:
 *    - If we encounter '(', we push its index onto the stack.
 *    - If we encounter ')', we check the stack:
 *      - If the stack is not empty, it means there is a matching '(', so we pop from the stack.
 *      - If the stack is empty, this ')' has no matching '(', so it needs to be removed. We add its index to a set of indices to remove.
 * 3. After iterating through the string, any indices remaining in the stack represent '(' that were never closed. These also need to be removed.
 * 4. Finally, we construct the result string by iterating through the original string and skipping characters at indices marked for removal.
 *
 * Time Complexity: O(n) - We traverse the string twice (once to mark removals, once to build result).
 * Space Complexity: O(n) - In the worst case, the stack and set can store O(n) indices.
 */
const minRemoveToMakeValid = (s) => {
  const stack = [];
  const remove = new Set();

  // Pass 1: Identify invalid parentheses
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      // Store index of open parenthesis
      stack.push(i);
    } else if (s[i] === ")") {
      if (stack.length) {
        // Found a match for an open parenthesis
        stack.pop();
      } else {
        // Unmatched closing parenthesis, mark for removal
        remove.add(i);
      }
    }
  }

  // Any remaining open parentheses in stack are unmatched
  while (stack.length) {
    remove.add(stack.pop());
  }

  // Pass 2: Build the valid string
  let result = "";
  for (let i = 0; i < s.length; i++) {
    if (!remove.has(i)) {
      result += s[i];
    }
  }
  return result;
};
