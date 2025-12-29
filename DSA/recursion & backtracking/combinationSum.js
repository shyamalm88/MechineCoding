/**
 * ============================================================================
 * PROBLEM: Combination Sum (LeetCode #39)
 * ============================================================================
 * Given an array of distinct integers candidates and a target integer target,
 * return a list of all unique combinations of candidates where the chosen
 * numbers sum to target. You may return the combinations in any order.
 *
 * The same number may be chosen from candidates an unlimited number of times.
 * Two combinations are unique if the frequency of at least one of the chosen
 * numbers is different.
 *
 * Example 1:
 * Input: candidates = [2,3,6,7], target = 7
 * Output: [[2,2,3],[7]]
 *
 * Example 2:
 * Input: candidates = [2,3,5], target = 8
 * Output: [[2,2,2,2],[2,3,3],[3,5]]
 *
 * Constraints:
 * - 1 <= candidates.length <= 30
 * - 1 <= target <= 500
 */

// ============================================================================
// APPROACH: Backtracking
// ============================================================================
/**
 * INTUITION:
 * At each step, we can choose a candidate. Since we can reuse candidates,
 * when we recurse, we pass the *same* index.
 * To avoid duplicates (like [2,3] and [3,2]), we only allow choosing numbers
 * from the current index onwards.
 *
 * Time Complexity: O(N^(T/M)) where N is candidates, T is target, M is min value.
 * Space Complexity: O(T/M) - Recursion depth (max number of elements in combination).
 */
const combinationSum = (candidates, target) => {
  const result = [];
  const currentCombination = [];

  const backtrack = (remaining, startIndex) => {
    if (remaining === 0) {
      result.push([...currentCombination]);
      return;
    }

    if (remaining < 0) return;

    for (let i = startIndex; i < candidates.length; i++) {
      // Choose candidate[i]
      currentCombination.push(candidates[i]);

      // Recurse with same index 'i' because we can reuse the same element
      backtrack(remaining - candidates[i], i);

      // Backtrack
      currentCombination.pop();
    }
  };

  backtrack(target, 0);
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Combination Sum Tests ===\n");
console.log("Test 1:", combinationSum([2, 3, 6, 7], 7));

module.exports = { combinationSum };