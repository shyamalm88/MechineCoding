/**
 * ============================================================================
 * PROBLEM: Permutations (LeetCode #46)
 * ============================================================================
 * Given an array nums of distinct integers, return all the possible permutations.
 * You can return the answer in any order.
 *
 * Example 1:
 * Input: nums = [1,2,3]
 * Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 *
 * Example 2:
 * Input: nums = [0,1]
 * Output: [[0,1],[1,0]]
 *
 * Constraints:
 * - 1 <= nums.length <= 6
 * - -10 <= nums[i] <= 10
 * - All the integers of nums are unique.
 */

// ============================================================================
// APPROACH: Backtracking (Swapping)
// ============================================================================
/**
 * INTUITION:
 * To generate all permutations, we can fix one number at the current position
 * and recursively permute the remaining positions.
 * We can do this in-place by swapping elements to place them in the "current"
 * position, recursing, and then swapping back (backtracking) to restore the state.
 *
 * Time Complexity: O(N * N!) - There are N! permutations, and copying takes O(N).
 * Space Complexity: O(N) - Recursion stack.
 */
var permute = function (nums) {
  const result = [];
  const curr = [];
  const used = new Array(nums.length).fill(false);

  const backtrack = () => {
    // base case: permutation complete
    if (curr.length === nums.length) {
      result.push([...curr]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      // choose
      used[i] = true;
      curr.push(nums[i]);

      // explore
      backtrack();

      // un-choose
      curr.pop();
      used[i] = false;
    }
  };

  backtrack();
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Permutations Tests ===\n");
console.log("Test 1:", permute([1, 2, 3]));

module.exports = { permute };
