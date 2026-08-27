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
