// ============================================================================
// APPROACH: Single-pass character scan with early overflow clamping
// ============================================================================
/**
 * STORY / INTUITION:
 * This problem isn't algorithmically hard — it's an EDGE-CASE GAUNTLET.
 * Walk through the string exactly like a human "reads" a number out loud:
 *
 * 1. Skip any leading spaces — they don't count.
 * 2. The very next character might be a sign ('+' or '-') — grab it once.
 * 3. From there, keep consuming DIGITS and building up the number.
 *    The moment you hit a non-digit (a letter, '.', another space, end of
 *    string) — STOP. Everything after that is irrelevant.
 * 4. If you never saw a digit at all, the answer is 0.
 *
 * OVERFLOW: JS numbers don't overflow like a 32-bit int would, so we check
 * after EVERY digit: if the number being built already exceeds INT_MAX
 * (or its negation exceeds INT_MIN), clamp and return immediately —
 * no need to keep building an astronomically large number first.
 *
 * DRY RUN: s = "   -42abc"
 * i=0..2: spaces → skip → i=3
 * i=3: '-' → sign=-1, i=4
 * i=4: '4' → num=4
 * i=5: '2' → num=42
 * i=6: 'a' → not a digit → stop
 * result = -1 * 42 = -42 ✓
 *
 * Time:  O(N) — single pass
 * Space: O(1)
 */
const myAtoi = (s) => {
  const INT_MAX = 2 ** 31 - 1; // 2147483647
  const INT_MIN = -(2 ** 31); // -2147483648

  let i = 0;
  const n = s.length;

  // Step 1: skip leading whitespace
  while (i < n && s[i] === " ") i++;

  // Step 2: optional sign (read at most once)
  let sign = 1;
  if (i < n && (s[i] === "+" || s[i] === "-")) {
    if (s[i] === "-") sign = -1;
    i++;
  }

  // Step 3: consume digits, clamping as soon as we'd overflow
  let num = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    num = num * 10 + (s.charCodeAt(i) - "0".charCodeAt(0));

    if (sign === 1 && num > INT_MAX) return INT_MAX;
    if (sign === -1 && -num < INT_MIN) return INT_MIN;

    i++;
  }

  return sign * num;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== String to Integer (atoi) Tests ===\n");

console.log("Test 1:", myAtoi("42"));               // Expected: 42
console.log("Test 2:", myAtoi("   -42"));            // Expected: -42
console.log("Test 3:", myAtoi("4193 with words"));   // Expected: 4193
console.log("Test 4:", myAtoi("words and 987"));     // Expected: 0
console.log("Test 5:", myAtoi("-91283472332"));      // Expected: -2147483648
console.log("Test 6:", myAtoi("91283472332"));       // Expected: 2147483647
console.log("Test 7:", myAtoi("+1"));                // Expected: 1
console.log("Test 8:", myAtoi(""));                  // Expected: 0
console.log("Test 9:", myAtoi("  +0 123"));          // Expected: 0

module.exports = { myAtoi };
