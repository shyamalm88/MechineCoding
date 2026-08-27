// ============================================================================
// APPROACH: Greedy (Range of Open Counts)
// ============================================================================
/**
 * INTUITION:
 * Since '*' is flexible, at any point in the string, we don't have a single
 * count of open parentheses. Instead, we have a range of possible open
 * parenthesis counts: [minOpen, maxOpen].
 *
 * - minOpen: The minimum number of open parentheses we MUST have (treating '*' as ')').
 * - maxOpen: The maximum number of open parentheses we COULD have (treating '*' as '(').
 *
 * Iteration logic:
 * - '(': Increment both minOpen and maxOpen.
 * - ')': Decrement both minOpen and maxOpen.
 * - '*': Decrement minOpen (treat as ')') and increment maxOpen (treat as '(').
 *
 * Validity checks during iteration:
 * 1. If maxOpen < 0: We have too many ')' even if we turned every '*' into '('. Invalid.
 * 2. If minOpen < 0: We treated too many '*' as ')'. Since '*' can be empty, we reset minOpen to 0.
 *
 * Final check:
 * - If minOpen == 0, it means it's possible to close all parentheses.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
const checkValidString = (s) => {
  let maxOpen = 0;
  let minOpen = 0;

  for (let ch of s) {
    if (ch === "(") {
      minOpen++;
      maxOpen++;
    } else if (ch === ")") {
      minOpen--;
      maxOpen--;
    } else {
      // Encountered '*':
      minOpen--;
      maxOpen++;
    }

    // If maxOpen is negative, we have more ')' than '(' + '*' combined. Impossible.
    if (maxOpen < 0) return false;

    // minOpen cannot be negative (we can't have negative open parentheses).
    // If it drops below zero, it implies we treated a '*' as ')' when we shouldn't have.
    // We treat that '*' as empty string instead.
    if (minOpen < 0) minOpen = 0;
  }

  return minOpen === 0;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Valid Parenthesis String Tests ===\n");
console.log("Test 1:", checkValidString("()")); // Expected: true
console.log("Test 2:", checkValidString("(*)")); // Expected: true
console.log("Test 3:", checkValidString("(*))")); // Expected: true

module.exports = { checkValidString };
