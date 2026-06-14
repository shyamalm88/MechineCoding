/**
 * ============================================================================
 * PROBLEM: Decode String (LeetCode #394)
 * ============================================================================
 * Given an encoded string, return its decoded form.
 * Encoding rule: k[encoded_string] means encoded_string repeated k times.
 * k is always a positive integer. Input is always valid.
 *
 * Example 1:
 * Input: "3[a]2[bc]"  → Output: "aaabcbc"
 *
 * Example 2:
 * Input: "3[a2[c]]"   → Output: "accaccacc"  (nested!)
 *
 * Example 3:
 * Input: "2[abc]3[cd]ef" → Output: "abcabccdcdcdef"
 *
 * Constraints:
 * - 1 <= s.length <= 30
 * - s consists of lowercase letters, digits, and square brackets
 * - All integers in s are in [1, 300]
 */

// ============================================================================
// APPROACH: Stack — push on '[', pop and expand on ']'
// ============================================================================
/**
 * STORY / INTUITION:
 * Think of nested gift boxes. When you see `3[`, you set aside what you've
 * built so far (push to stack) and start filling the inner box.
 * When you see `]`, you close the box, repeat its contents k times,
 * and attach it to whatever you had before (pop from stack).
 *
 * Stack stores pairs: [countSoFar, stringSoFar]
 *
 * DRY RUN: "3[a2[c]]"
 * '3'  → curNum=3
 * '['  → push(3, ""), curStr="", curNum=0
 * 'a'  → curStr="a"
 * '2'  → curNum=2
 * '['  → push(2, "a"), curStr="", curNum=0
 * 'c'  → curStr="c"
 * ']'  → pop(2,"a"), curStr = "a" + "c".repeat(2) = "acc"
 * ']'  → pop(3,""),  curStr = "" + "acc".repeat(3) = "accaccacc"
 * Result: "accaccacc" ✓
 *
 * Time:  O(maxK^depth * N) where maxK is max multiplier, depth is nesting
 *        In practice O(output_length) which is the unavoidable cost of building the string
 * Space: O(N) for stack
 */
const decodeString = (s) => {
  const stack = []; // stores [repeatCount, accumulatedStr]
  let curStr = "";
  let curNum = 0;

  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      // Build multi-digit numbers
      curNum = curNum * 10 + Number(ch);
    } else if (ch === "[") {
      // Save current state and start fresh for inner content
      stack.push([curNum, curStr]);
      curStr = "";
      curNum = 0;
    } else if (ch === "]") {
      // Close inner box: pop state and repeat
      const [count, prevStr] = stack.pop();
      curStr = prevStr + curStr.repeat(count);
    } else {
      curStr += ch;
    }
  }

  return curStr;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Decode String Tests ===\n");

console.log("Test 1:", decodeString("3[a]2[bc]"));     // Expected: "aaabcbc"
console.log("Test 2:", decodeString("3[a2[c]]"));      // Expected: "accaccacc"
console.log("Test 3:", decodeString("2[abc]3[cd]ef")); // Expected: "abcabccdcdcdef"
console.log("Test 4:", decodeString("100[a]"));        // Expected: "aaa...a" (100 a's)

module.exports = { decodeString };
