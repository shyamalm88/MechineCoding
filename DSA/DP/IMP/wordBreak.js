/**
 * ============================================================================
 * PROBLEM: Word Break (LeetCode #139)
 * ============================================================================
 * Given a string s and a dictionary of strings wordDict, return true if s can be
 * segmented into a space-separated sequence of one or more dictionary words.
 *
 * Note that the same word in the dictionary may be reused multiple times in the segmentation.
 *
 * Example 1:
 * Input: s = "leetcode", wordDict = ["leet","code"]
 * Output: true
 * Explanation: Return true because "leetcode" can be segmented as "leet code".
 *
 * Example 2:
 * Input: s = "applepenapple", wordDict = ["apple", "pen"]
 * Output: true
 * Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
 * Note that you are allowed to reuse a dictionary word.
 *
 * Constraints:
 * - 1 <= s.length <= 300
 * - 1 <= wordDict.length <= 1000
 * - 1 <= wordDict[i].length <= 20
 * - s and wordDict[i] consist of only lowercase English letters.
 */

// ============================================================================
// APPROACH: Dynamic Programming (Top-Down / Memoization)
// ============================================================================
/**
 * INTUITION:
 * We want to know if s[0...n] can be broken.
 * We can try every possible prefix s[0...i]. If s[0...i] is a valid word,
 * then we recursively check if the remaining substring s[i...n] can be broken.
 *
 * To avoid re-calculating the result for the same starting index multiple times,
 * we use a memoization table (map or array).
 *
 * Time Complexity: O(N^3) - There are N states. For each state, we iterate up to N times.
 *                  String slicing takes O(N). Total O(N^3).
 * Space Complexity: O(N) - Recursion depth and memoization storage.
 */
const wordBreak = (s, wordDict) => {
  const wordSet = new Set(wordDict);
  const memo = new Map();

  const dfs = (start) => {
    if (start === s.length) return true;
    if (memo.has(start)) return memo.get(start);

    for (let end = start + 1; end <= s.length; end++) {
      const word = s.slice(start, end);

      if (wordSet.has(word) && dfs(end)) {
        memo.set(start, true);
        return true;
      }
    }

    memo.set(start, false);
    return false;
  };

  return dfs(0);
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
