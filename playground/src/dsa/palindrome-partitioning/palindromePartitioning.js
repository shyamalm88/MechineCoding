// ============================================================================
// APPROACH: Backtracking
// ============================================================================
/**
 * INTUITION:
 * We want to cut the string into pieces.
 * At index `start`, we can cut at `end` (where start <= end < length) IF
 * the substring s[start...end] is a palindrome.
 * If it is, we add it to our current list and recurse for the rest of the string.
 *
 * Time Complexity: O(N * 2^N) - In worst case (e.g., "aaaa"), every substring is valid.
 * Space Complexity: O(N) - Recursion stack.
 */
const partition = (s) => {
  const result = [];
  const currentPartition = [];

  const isPalindrome = (str, l, r) => {
    while (l < r) {
      if (str[l] !== str[r]) return false;
      l++;
      r--;
    }
    return true;
  };

  const backtrack = (start) => {
    if (start === s.length) {
      result.push([...currentPartition]);
      return;
    }

    for (let end = start; end < s.length; end++) {
      if (isPalindrome(s, start, end)) {
        // Choose: Cut here
        currentPartition.push(s.slice(start, end + 1));

        // Explore
        backtrack(end + 1);

        // Unchoose (Backtrack)
        currentPartition.pop();
      }
    }
  };

  backtrack(0);
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Palindrome Partitioning Tests ===\n");
console.log("Test 1:", partition("aab")); // Expected: [["a","a","b"],["aa","b"]]
console.log("Test 2:", partition("a")); // Expected: [["a"]]

module.exports = { partition };
