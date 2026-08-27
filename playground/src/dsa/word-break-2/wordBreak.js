// ============================================================================
// APPROACH: Recursion with Memoization (Top-Down DP)
// ============================================================================
/**
 * INTUITION:
 * We check every possible prefix of the string starting at `index`.
 * If the prefix is in the dictionary, we recursively check if the remaining
 * substring (starting at `i + 1`) can be segmented.
 *
 * We use a map (memoization) to store the result for each starting index to
 * avoid re-calculating the same subproblems.
 *
 * Time Complexity: O(N^3) - N states, loop N times, slice takes N.
 * Space Complexity: O(N) - Recursion stack and memoization map.
 */
const wordBreak = (s, wordDict) => {
  const wordSet = new Set(wordDict);
  const memo = new Map();

  const backtrack = (index) => {
    // Base Case: Reached end of string
    if (index === s.length) {
      return true;
    }

    // Check Memoization
    if (memo.has(index)) return memo.get(index);

    // Try every possible substring starting from 'index'
    for (let i = index; i < s.length; i++) {
      const word = s.slice(index, i + 1);

      // If the current substring is a valid word AND the rest of the string can be segmented
      if (wordSet.has(word) && backtrack(i + 1)) {
        memo.set(index, true); // Memoize success
        return true;
      }
    }

    // If no valid segmentation is found from this index, memoize failure
    memo.set(index, false);
    return false;
  };
  return backtrack(0);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Word Break Tests ===\n");
console.log("Test 1:", wordBreak("leetcode", ["leet", "code"])); // Expected: true
console.log("Test 2:", wordBreak("applepenapple", ["apple", "pen"])); // Expected: true
console.log(
  "Test 3:",
  wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])
); // Expected: false

module.exports = { wordBreak };
