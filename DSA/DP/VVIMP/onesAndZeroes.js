/**
 * ============================================================================
 * PROBLEM: Ones and Zeroes (LeetCode #474)
 * CATEGORY: 🔴 VVIMP (2D 0/1 Knapsack — Two Capacity Dimensions)
 * ============================================================================
 * You are given an array of binary strings `strs` and two integers `m` and `n`.
 *
 * Return the size of the largest subset of `strs` such that there are AT MOST
 * `m` 0's and `n` 1's in total across the subset.
 *
 * Example 1:
 * Input: strs=["10","0001","111001","1","0"], m=5, n=3
 * Output: 4
 * Explanation: subset {"10","0001","1","0"} uses 5 zeros and 3 ones (4 items).
 *
 * Example 2:
 * Input: strs=["10","0","1"], m=1, n=1
 * Output: 2
 * Explanation: subset {"0","1"} uses 1 zero and 1 one.
 *
 * Constraints:
 * - 1 <= strs.length <= 600
 * - 1 <= strs[i].length <= 100
 * - strs[i] consists only of '0' and '1'
 * - 1 <= m, n <= 100
 */

// ============================================================================
// APPROACH: 2D 0/1 Knapsack (dp[zeros][ones] = max items)
// ============================================================================
/**
 * STORY / INTUITION:
 * This is Partition Equal Subset Sum's 0/1 knapsack idea, but the "capacity"
 * is now TWO-DIMENSIONAL: every item (string) consumes some of a "zeros
 * budget" AND some of a "ones budget" simultaneously, and we want to MAXIMIZE
 * the COUNT of items picked (not a sum).
 *
 * Let dp[i][j] = the max number of strings we can pick using AT MOST `i`
 * zeros and `j` ones. For each string with (z zeros, o ones):
 *   dp[i][j] = max( dp[i][j],            // don't take this string
 *                    dp[i-z][j-o] + 1 )   // take it (1 more item)
 *
 * Just like 1D 0/1 knapsack, iterate `i` from m DOWN to z and `j` from n
 * DOWN to o for each item — this guarantees dp[i-z][j-o] still reflects the
 * state BEFORE this item was considered, so each string is used at most once.
 *
 * DRY RUN: strs=["10","0001","111001","1","0"], m=5, n=3
 * "10"  -> (z=1,o=1)
 * "0001"-> (z=3,o=1)
 * "111001" -> (z=2,o=4)  -- o=4 > n=3, can NEVER be picked, contributes nothing
 * "1"   -> (z=0,o=1)
 * "0"   -> (z=1,o=0)
 *
 * After "10":      dp[i][j]=1 for all i>=1,j>=1
 * After "0001":    dp[5][3]=2, dp[4][3]=2, dp[4][2]=2 ... (combine "10"+"0001")
 * After "111001":  no change (o=4 exceeds n=3 for every j)
 * After "1":       dp[5][3]=3 (e.g. "10"+"0001"+"1" uses z=1+3+0=4<=5, o=1+1+1=3<=3)
 * After "0":       dp[5][3]=4 (e.g. "10"+"0001"+"1"+"0" uses z=5,o=3)
 *
 * Result: dp[5][3]=4 ✓
 *
 * Time:  O(L * m * n) — L strings, each doing an O(m*n) table update
 * Space: O(m * n) — the dp table
 */
const findMaxForm = (strs, m, n) => {
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (const str of strs) {
    let zeros = 0, ones = 0;
    for (const ch of str) {
      if (ch === "0") zeros++;
      else ones++;
    }

    for (let i = m; i >= zeros; i--) {
      for (let j = n; j >= ones; j--) {
        dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
      }
    }
  }

  return dp[m][n];
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Ones and Zeroes Tests ===\n");

console.log("Test 1:", findMaxForm(["10", "0001", "111001", "1", "0"], 5, 3)); // Expected: 4
console.log("Test 2:", findMaxForm(["10", "0", "1"], 1, 1)); // Expected: 2
console.log("Test 3:", findMaxForm(["0", "0", "1", "1"], 0, 0)); // Expected: 0 (no budget for any string)

module.exports = { findMaxForm };
