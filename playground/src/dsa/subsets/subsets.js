// ============================================================================
// APPROACH: Backtracking (Include/Exclude)
// ============================================================================
/**
 * INTUITION:
 * For every element in the array, we have exactly two choices:
 * 1. Include it in the current subset.
 * 2. Exclude it from the current subset.
 *
 * Time Complexity: O(N * 2^N) - 2^N subsets, each takes O(N) to copy.
 * Space Complexity: O(N) - Recursion stack.
 */
const subsets = (nums) => {
  const result = [];
  const currentSubset = [];

  const backtrack = (index) => {
    // Base Case: Processed all elements
    if (index === nums.length) {
      result.push([...currentSubset]);
      return;
    }

    // Choice 1: Include nums[index]
    currentSubset.push(nums[index]);
    backtrack(index + 1);

    // Choice 2: Exclude nums[index] (Backtrack)
    currentSubset.pop();
    backtrack(index + 1);
  };

  backtrack(0);
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Subsets Tests ===\n");
console.log("Test 1:", subsets([1, 2, 3]));

module.exports = { subsets };
