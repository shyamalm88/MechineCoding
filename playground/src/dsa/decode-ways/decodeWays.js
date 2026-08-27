// ============================================================================
// APPROACH: Dynamic Programming (Top-Down)
// ============================================================================
/**
 * INTUITION:
 * At index `i`, we can:
 * 1. Take 1 digit: Valid if s[i] != '0'. Recurse on i+1.
 * 2. Take 2 digits: Valid if s[i...i+1] is between "10" and "26". Recurse on i+2.
 * Sum the ways from both valid choices.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
const numDecodings = (s) => {
  const memo = {};

  const dfs = (i) => {
    // reached end → one valid decoding
    if (i === s.length) return 1;

    // cannot decode a string starting with '0'
    if (s[i] === "0") return 0;

    // memo hit
    if (memo[i] !== undefined) return memo[i];

    // take one digit
    let ways = dfs(i + 1);

    // take two digits if valid
    if (i + 1 < s.length) {
      const num = Number(s.slice(i, i + 2));
      if (num >= 10 && num <= 26) {
        ways += dfs(i + 2);
      }
    }

    memo[i] = ways;
    return ways;
  };

  return dfs(0);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Decode Ways Tests ===\n");

console.log("Test 1:", numDecodings("12")); // Expected: 2
console.log("Test 2:", numDecodings("226")); // Expected: 3
console.log("Test 3:", numDecodings("06")); // Expected: 0

module.exports = { numDecodings };
