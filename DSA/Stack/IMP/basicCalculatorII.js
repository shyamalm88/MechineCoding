/**
 * ============================================================================
 * PROBLEM: Basic Calculator II (LeetCode #227)
 * ============================================================================
 * Given a string `s` representing a non-negative integer arithmetic
 * expression, evaluate it and return the result. The expression contains
 * only non-negative integers, '+', '-', '*', '/' operators, and empty
 * spaces. The integer division should truncate toward zero.
 *
 * There are NO parentheses in the expression.
 *
 * Example 1:
 * Input: s = "3+2*2"
 * Output: 7
 *
 * Example 2:
 * Input: s = " 3/2 "
 * Output: 1
 *
 * Example 3:
 * Input: s = " 3+5 / 2 "
 * Output: 5
 *
 * Constraints:
 * - 1 <= s.length <= 3 * 10^5
 * - s consists of integers and operators ('+','-','*','/') separated by
 *   some number of spaces.
 * - s represents a valid expression.
 * - All intermediate results will be in the range [-2^31, 2^31 - 1].
 */

// ============================================================================
// APPROACH: Stack + "resolve on sight" for * and /
// ============================================================================
/**
 * STORY / INTUITION:
 * Without parentheses, the only thing that changes the ORDER of evaluation
 * is operator precedence: '*' and '/' bind tighter than '+' and '-'.
 *
 * Trick: process the string left to right, building up each number digit by
 * digit. As soon as we hit the NEXT operator (or the end of the string), we
 * know the FULL number we just finished reading, and we know what to do with
 * it based on the PREVIOUS operator (`sign`):
 *
 * - prev sign '+' → push  num   onto the stack
 * - prev sign '-' → push -num   onto the stack
 * - prev sign '*' → pop the last value, push (last * num)
 * - prev sign '/' → pop the last value, push trunc(last / num)
 *
 * '*' and '/' are resolved IMMEDIATELY against the value already on top of
 * the stack — that's how precedence is enforced without a separate pass.
 * '+' and '-' just get queued onto the stack as signed values; at the end we
 * sum everything left in the stack.
 *
 * DRY RUN: s = "3+2*2"
 * sign starts as '+', num=0
 *
 * i=0 '3': num=3
 * i=1 '+': finish num=3, sign was '+' → push 3        → stack=[3]
 *          sign='+', num=0
 * i=2 '2': num=2
 * i=3 '*': finish num=2, sign was '+' → push 2        → stack=[3,2]
 *          sign='*', num=0
 * i=4 '2' (last char): finish num=2, sign was '*'
 *          → pop 2, push 2*2=4                         → stack=[3,4]
 *
 * sum(stack) = 3 + 4 = 7 ✓
 *
 * Time:  O(N) — single pass
 * Space: O(N) — stack holds at most one entry per '+'/'-' term
 */
const calculate = (s) => {
  const stack = [];
  let num = 0;
  let sign = "+"; // the operator that PRECEDES the number we're building

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const isDigit = char >= "0" && char <= "9";

    // lets assume number is 123
    // num = 0 * 10 + 1
    // = 1
    // then num = 1 * 10 + 2
    // = 12
    // then again
    // num = 12 * 10 + 3
    // = 123

    if (isDigit) {
      num = num * 10 + Number(char);
    }

    // Hit an operator (not a space) or the end of the string → number is complete
    const isLastChar = i === s.length - 1;
    if ((!isDigit && char !== " ") || isLastChar) {
      if (sign === "+") stack.push(num);
      else if (sign === "-") stack.push(-num);
      else if (sign === "*") stack.push(stack.pop() * num);
      else if (sign === "/") stack.push(Math.trunc(stack.pop() / num));

      sign = char;
      num = 0;
    }
  }

  return stack.reduce((sum, n) => sum + n, 0);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Basic Calculator II Tests ===\n");

console.log("Test 1:", calculate("3+2*2")); // Expected: 7
console.log("Test 2:", calculate(" 3/2 ")); // Expected: 1
console.log("Test 3:", calculate(" 3+5 / 2 ")); // Expected: 5
console.log("Test 4:", calculate("14-3/2")); // Expected: 13
console.log("Test 5:", calculate("1*2-3/4+5*6")); // Expected: 32

module.exports = { calculate };
