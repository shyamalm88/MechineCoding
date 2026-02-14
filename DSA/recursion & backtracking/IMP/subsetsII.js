/**
 * ============================================================================
 * PROBLEM: Subsets II (LeetCode #90)
 * CATEGORY: 🟢 IMPORTANT (Backtracking + Duplicate Handling)
 * ============================================================================
 *
 * Given an integer array nums that may contain duplicates,
 * return all possible UNIQUE subsets.
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   nums = [1,2,2]
 *
 *   Output:
 *   [
 *     [],
 *     [1],
 *     [1,2],
 *     [1,2,2],
 *     [2],
 *     [2,2]
 *   ]
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 *
 * This looks like subsets,
 * BUT duplicates break naive recursion.
 *
 * Key Insight (CRITICAL):
 *
 *   Duplicates only cause problems at the SAME recursion depth.
 *
 * Solution:
 * - Sort the array
 * - Skip duplicates WHEN they appear at the same level
 *
 * ============================================================================
 * BACKTRACKING STATE
 * ============================================================================
 *
 * State:
 * - path
 * - start index
 *
 * ============================================================================
 * DUPLICATE RULE (VERY IMPORTANT)
 * ============================================================================
 *
 * If:
 *   i > start AND nums[i] === nums[i - 1]
 *
 * Then:
 *   skip nums[i]
 *
 * Why?
 * - Prevents generating identical subsets
 *
 * ============================================================================
 * TIME COMPLEXITY
 * ============================================================================
 *
 * O(2^n)
 *
 * ============================================================================
 * WHY THIS IS 🟢 IMPORTANT
 * ============================================================================
 *
 * Duplicate handling is one of the MOST common
 * backtracking interview mistakes.
 * ============================================================================
 */

function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  function backtrack(start, path) {
    result.push([...path]);

    for (let i = start; i < nums.length; i++) {
      // skip duplicates at the same recursion level
      if (i > start && nums[i] === nums[i - 1]) continue;

      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }

  backtrack(0, []);
  return result;
}
