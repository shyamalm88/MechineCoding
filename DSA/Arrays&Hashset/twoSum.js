/**
 * ============================================================================
 * PROBLEM: Two Sum (LeetCode #1)
 * ============================================================================
 * Given an array of integers nums and an integer target, return indices of the
 * two numbers that add up to target. Each input has exactly one solution.
 * You may not use the same element twice.
 *
 * Example 1:
 * Input: nums=[2,7,11,15], target=9 → Output: [0,1]
 *
 * Example 2:
 * Input: nums=[3,2,4], target=6 → Output: [1,2]
 *
 * Example 3:
 * Input: nums=[3,3], target=6 → Output: [0,1]
 *
 * Constraints:
 * - 2 <= nums.length <= 10^4
 * - -10^9 <= nums[i] <= 10^9
 * - Exactly one valid answer
 */

// ============================================================================
// APPROACH: HashMap — One Pass
// ============================================================================
/**
 * STORY / INTUITION:
 * As we walk through the array, for each number we ask:
 * "Have I seen the number that would complete my pair (target - current)?"
 * The HashMap acts as memory — it tells us in O(1) if we've seen the complement.
 *
 * KEY: We store { value → index } so we can return both indices.
 * We check BEFORE adding to the map (handles the same-element-used-twice constraint).
 *
 * DRY RUN: nums=[3,2,4], target=6
 * i=0, num=3: complement=3. Map has 3? No. Add {3:0}.
 * i=1, num=2: complement=4. Map has 4? No. Add {3:0, 2:1}.
 * i=2, num=4: complement=2. Map has 2? YES at index 1. Return [1,2] ✓
 *
 * Time:  O(N)
 * Space: O(N)
 */
const twoSum = (nums, target) => {
  const seen = new Map(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Two Sum Tests ===\n");

console.log("Test 1:", twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log("Test 2:", twoSum([3, 2, 4], 6));       // Expected: [1, 2]
console.log("Test 3:", twoSum([3, 3], 6));           // Expected: [0, 1]

module.exports = { twoSum };
