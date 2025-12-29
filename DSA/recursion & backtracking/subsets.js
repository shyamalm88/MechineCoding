/**
 * ============================================================================
 * PROBLEM: Subsets (LeetCode #78)
 * ============================================================================
 * Given an integer array nums of unique elements, return all possible subsets
 * (the power set).
 *
 * The solution set must not contain duplicate subsets. Return the solution in any order.
 *
 * Example 1:
 * Input: nums = [1,2,3]
 * Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 *
 * Example 2:
 * Input: nums = [0]
 * Output: [[],[0]]
 *
 * Constraints:
 * - 1 <= nums.length <= 10
 * - -10 <= nums[i] <= 10
 * - All the numbers of nums are unique.
 */

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