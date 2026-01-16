/**
 * ============================================================================
 * PROBLEM: Word Break II (LeetCode #140)
 * ============================================================================
 * Given a string s and a dictionary of strings wordDict, add spaces in s to
 * construct a sentence where each word is a valid dictionary word. Return all
 * such possible sentences in any order.
 *
 * Note that the same word in the dictionary may be reused multiple times in
 * the segmentation.
 *
 * Example 1:
 * Input: s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
 * Output: ["cats and dog","cat sand dog"]
 *
 * Example 2:
 * Input: s = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"]
 * Output: ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
 *
 * Example 3:
 * Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
 * Output: []
 *
 * Constraints:
 * - 1 <= s.length <= 20
 * - 1 <= wordDict.length <= 1000
 * - 1 <= wordDict[i].length <= 10
 * - s and wordDict[i] consist of only lowercase English letters.
 * - All the strings of wordDict are unique.
 */

// ============================================================================
// APPROACH: Backtracking (DFS)
// ============================================================================
/**
 * INTUITION:
 * We need to find ALL possible ways to break the string. This suggests an
 * exhaustive search. We can use backtracking (DFS).
 *
 * At any index `start`, we iterate through all possible end indices `i` (from
 * start to end of string).
 * If the substring s[start...i] exists in the dictionary:
 * 1. We choose this word.
 * 2. We recursively call the function for the remaining substring (starting at i+1).
 * 3. When the recursion returns (backtracks), we remove the chosen word and try
 *    the next possibility.
 *
 * TIME COMPLEXITY: O(N * 2^N)
 * - In the worst case (e.g., s="aaaa...", wordDict=["a", "aa", "aaa"]), every
 *   prefix is a valid word.
 * - There are 2^(N-1) possible ways to put spaces in a string of length N.
 * - For each valid partition, we spend O(N) to join strings.
 * - Thus, O(N * 2^N).
 *
 * SPACE COMPLEXITY: O(N * 2^N)
 * - To store the results (all possible sentences).
 * - Recursion stack depth is O(N).
 */

const wordBreak = (s, wordDict) => {
  const wordSet = new Set(wordDict);
  const res = [];
  const curr = [];

  const backtrack = (index) => {
    // Base Case: Reached end of string
    if (index === s.length) {
      res.push(curr.join(" "));
      return;
    }

    // Try every possible substring starting from 'index'
    for (let i = index; i < s.length; i++) {
      const word = s.slice(index, i + 1);

      // Pruning: Only proceed if the substring is a valid word
      if (wordSet.has(word)) {
        // Choose
        curr.push(word);

        // Explore
        backtrack(i + 1);

        // Unchoose (Backtrack)
        curr.pop();
      }
    }
  };

  backtrack(0);
  return res;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Word Break II Tests ===\n");

console.log(
  "Test 1:",
  wordBreak("catsanddog", ["cat", "cats", "and", "sand", "dog"])
);
// Expected: ["cat sand dog", "cats and dog"] (order may vary)

console.log(
  "Test 2:",
  wordBreak("pineapplepenapple", [
    "apple",
    "pen",
    "applepen",
    "pine",
    "pineapple",
  ])
);
// Expected: ["pine apple pen apple", "pineapple pen apple", "pine applepen apple"]

console.log(
  "Test 3:",
  wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])
);
// Expected: []

module.exports = { wordBreak };
