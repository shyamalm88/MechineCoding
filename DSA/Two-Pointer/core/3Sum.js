/**
 * ============================================================================
 * PROBLEM: 3Sum (LeetCode #15)
 * ============================================================================
 * Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]]
 * such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
 *
 * Notice that the solution set must not contain duplicate triplets.
 *
 * Example 1:
 * Input: nums = [-1,0,1,2,-1,-4]
 * Output: [[-1,-1,2],[-1,0,1]]
 * Explanation:
 * nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
 * nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
 * nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
 * The distinct triplets are [-1,0,1] and [-1,-1,2].
 *
 * Example 2:
 * Input: nums = [0,1,1]
 * Output: []
 *
 * Constraints:
 * - 3 <= nums.length <= 3000
 * - -10^5 <= nums[i] <= 10^5
 */

// ============================================================================
// APPROACH: Sorting + Two Pointers
// ============================================================================
/**
 * INTUITION:
 * To solve a + b + c = 0, we can fix 'a' and solve b + c = -a.
 * This reduces the problem to "Two Sum II" (finding a pair with a target sum).
 *
 * 1. Sort the array. This allows us to use Two Pointers and easily skip duplicates.
 * 2. Iterate through the array with index `i` (this is our 'a').
 * 3. Use two pointers `left` (i+1) and `right` (n-1) to find pairs.
 * 4. Crucial Step: Skip duplicate values for `i`, `left`, and `right` to ensure unique triplets.
 *
 * Time Complexity: O(N^2) - Sorting is O(N log N), the nested loop is O(N^2).
 * Space Complexity: O(1) or O(N) depending on sorting implementation (ignoring output).
 */
const threeSum = (nums) => {
  const result = [];
  // 1. Sort the array to use two pointers and handle duplicates
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 2; i++) {
    // 2. Skip duplicates for the first element 'a' to avoid duplicate triplets
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;

        // 3. Skip duplicates for the second element 'b'
        while (left < right && nums[left] === nums[left - 1]) left++;
        // 4. Skip duplicates for the third element 'c'
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (sum < 0) {
        left++; // Need a larger sum
      } else {
        right--; // Need a smaller sum
      }
    }
  }
  return result;
};

console.log("=== 3Sum Tests ===\n");
console.log("Test 1:", threeSum([-1, 0, 1, 2, -1, -4])); // Expected: [[-1,-1,2],[-1,0,1]]
console.log("Test 2:", threeSum([0, 1, 1])); // Expected: []

module.exports = { threeSum };
