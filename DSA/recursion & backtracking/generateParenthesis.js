/**
 * @param {number} num - The number of pairs of parentheses
 * @return {string[]} - All valid combinations
 */
const generateParenthesis = (num) => {
  const result = [];

  /**
   * Helper function for Backtracking
   * @param {string} curr - The current string being built
   * @param {number} open - Count of open brackets '(' used so far
   * @param {number} close - Count of closed brackets ')' used so far
   */
  const backTrack = (curr, open, close) => {
    // 🛑 BASE CASE:
    // If the string length equals 2 * n, we have used all pairs.
    // The string is guaranteed to be valid because of our logic below.
    if (curr.length === num * 2) {
      result.push(curr);
      return; // Return to explore other paths
    }

    // 🟢 DECISION 1: Add Open Bracket '('
    // Constraint: We can only add an open bracket if we haven't used
    // our entire quota of 'num'.
    if (open < num) {
      backTrack(curr + "(", open + 1, close);
    }

    // 🟢 DECISION 2: Add Closed Bracket ')'
    // Constraint: We can only add a closed bracket if it matches
    // an unclosed open bracket (i.e., we have more opens than closes).
    // This ensures we never create invalid prefixes like "())".
    if (close < open) {
      backTrack(curr + ")", open, close + 1);
    }
  };

  // Start with empty string and 0 counts
  backTrack("", 0, 0);
  return result;
};
