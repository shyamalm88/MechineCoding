// ============================================================================
// APPROACH: Backtracking with Sorting (to handle duplicates)
// ============================================================================
/**
 * INTUITION:
 * Unlike Combination Sum I, we cannot reuse the same element index.
 * Also, the input array may contain duplicate numbers (e.g., [1, 2, 1]).
 * If we just used standard backtracking, we might get duplicate combinations
 * like [1(first), 2] and [1(second), 2].
 *
 * To solve this:
 * 1. Sort the array first. This groups duplicates together.
 * 2. In the loop, if we encounter a number that is the same as the previous
 *    number (candidates[i] == candidates[i-1]) AND we are not at the start
 *    of the current recursion level (i > startIndex), we skip it.
 *
 *    Why? Because the previous identical number has already started a recursion
 *    branch that covers all possibilities involving that number at this position.
 *
 * Time Complexity: O(2^N) - In worst case.
 * Space Complexity: O(N) - Recursion stack.
 */
const combinationSumII = (candidates, target) => {
  const result = [];
  const currentSum = [];

  // Sort to handle duplicates and optimize early breaking
  candidates.sort((a, b) => a - b);

  const backTrack = (remaining, startIndex) => {
    // Base Case: Target reached
    if (remaining === 0) {
      result.push([...currentSum]);
      return;
    }

    for (let i = startIndex; i < candidates.length; i++) {
      // Skip duplicates:
      // If this is not the first element we're picking in this loop iteration,
      // and it's the same as the previous one, skip it to avoid duplicate sets.
      if (i > startIndex && candidates[i] == candidates[i - 1]) continue;

      // Optimization: Since array is sorted, if current is > remaining,
      // no subsequent numbers will fit either.
      if (candidates[i] > remaining) break;

      // Choose
      currentSum.push(candidates[i]);

      // Explore (pass i + 1 because we can't reuse the same element)
      backTrack(remaining - candidates[i], i + 1);

      // Unchoose (Backtrack)
      currentSum.pop();
    }
  };
  backTrack(target, 0);
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Combination Sum II Tests ===\n");
console.log("Test 1:", combinationSumII([10, 1, 2, 7, 6, 1, 5], 8));
// Expected: [[1,1,6], [1,2,5], [1,7], [2,6]]

console.log("Test 2:", combinationSumII([2, 5, 2, 1, 2], 5));
// Expected: [[1,2,2], [5]]

module.exports = { combinationSumII };
