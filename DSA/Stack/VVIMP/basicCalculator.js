/**
 * PROBLEM: Basic Calculator (LeetCode #224)
 *
 * Evaluate a string with +, -, non-negative integers and PARENTHESES.
 * (No * or / — that is #227.)
 *
 * INTUITION:
 * Parentheses only ever flip signs here, so you never need to recurse or build
 * a tree. Carry a running `sign` (+1/-1) and push the pending state onto a
 * stack when a '(' opens:
 *
 *   '('  → push (result, sign), then reset both for the sub-expression
 *   ')'  → result = result * savedSign + savedResult
 *
 * Accumulate multi-digit numbers with `num = num * 10 + digit` — a single-digit
 * assumption is the usual bug.
 *
 * DRY RUN: "(1+(4+5))-3"
 *   '(' push(0,+1), reset
 *   1 → result 1
 *   '(' push(1,+1), reset
 *   4+5 → result 9
 *   ')' → 9*1 + 1 = 10
 *   ')' → 10*1 + 0 = 10
 *   -3 → 7
 *
 * TIME: O(n)   SPACE: O(n) for nesting depth
 */
const calculate = (s) => {
  const stack = [];
  let result = 0;
  let num = 0;
  let sign = 1;

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + Number(ch); // multi-digit
    } else if (ch === '+' || ch === '-') {
      result += sign * num;
      num = 0;
      sign = ch === '+' ? 1 : -1;
    } else if (ch === '(') {
      stack.push(result, sign); // remember the outer context
      result = 0;
      sign = 1;
    } else if (ch === ')') {
      result += sign * num;
      num = 0;
      const outerSign = stack.pop();
      const outerResult = stack.pop();
      result = result * outerSign + outerResult;
    }
    // spaces ignored
  }
  return result + sign * num; // flush the trailing number
};

console.log(calculate('1 + 1')); // 2
console.log(calculate(' 2-1 + 2 ')); // 3
console.log(calculate('(1+(4+5+2)-3)+(6+8)')); // 23
console.log(calculate('-(3+4)')); // -7 -- leading unary minus
