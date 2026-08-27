// ============================================================================
// APPROACH: Monotonic Increasing Stack (Greedy)
// ============================================================================
/**
 * STORY / INTUITION:
 * To make the number as small as possible, we want the leftmost digits to be
 * as small as possible. Greedy insight: if we see a digit smaller than the
 * one before it, removing the larger one (earlier digit) makes the number smaller.
 *
 * Maintain a MONOTONIC INCREASING stack. For each digit:
 * - While k > 0 and stack top > current digit → pop (remove that bigger digit)
 * - Push current digit
 *
 * After processing, if k > 0 still, remove from the end (they're ascending,
 * so removing the largest tail reduces the number least aggressively).
 *
 * Finally, strip leading zeros.
 *
 * DRY RUN: num="1432219", k=3
 * '1': stack=[1]
 * '4': 4>1 → push → [1,4]
 * '3': 3<4 → pop 4 (k=2), 3>1 → push → [1,3]
 * '2': 2<3 → pop 3 (k=1), 2>1 → push → [1,2]
 * '2': 2=2 → push → [1,2,2]
 * '1': 1<2 → pop 2 (k=0), can't pop more → push 1 → [1,2,1]
 * '9': push → [1,2,1,9]
 * k=0, no tail removal. Result: "1219" ✓
 *
 * Time:  O(N)
 * Space: O(N)
 */
const removeKdigits = (num, k) => {
  const stack = [];

  for (const digit of num) {
    // Pop larger digits from stack when we can still remove (k > 0)
    while (k > 0 && stack.length && stack[stack.length - 1] > digit) {
      stack.pop();
      k--;
    }
    stack.push(digit);
  }

  // If k still > 0, remove from the end (monotone tail is increasing)
  if (k > 0) stack.splice(stack.length - k, k);

  // Convert to string and strip leading zeros
  const result = stack.join("").replace(/^0+/, "") || "0";
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Remove K Digits Tests ===\n");

console.log("Test 1:", removeKdigits("1432219", 3)); // Expected: "1219"
console.log("Test 2:", removeKdigits("10200", 1));   // Expected: "200"
console.log("Test 3:", removeKdigits("10", 2));      // Expected: "0"
console.log("Test 4:", removeKdigits("9", 1));       // Expected: "0"

module.exports = { removeKdigits };
