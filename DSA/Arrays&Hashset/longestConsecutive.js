/**
 * ============================================================================
 * PROBLEM: Longest Consecutive Sequence (LeetCode #128)
 * ============================================================================
 * Given an unsorted array of integers nums, return the length of the longest
 * consecutive elements sequence.
 *
 * You must write an algorithm that runs in O(n) time.
 *
 * Example 1:
 * Input: nums = [100,4,200,1,3,2]
 * Output: 4
 * Explanation: The longest consecutive elements sequence is [1, 2, 3, 4].
 *
 * Example 2:
 * Input: nums = [0,3,7,2,5,8,4,6,0,1]
 * Output: 9
 *
 * Constraints:
 * - 0 <= nums.length <= 10^5
 * - -10^9 <= nums[i] <= 10^9
 */

// ============================================================================
// APPROACH: HashSet
// ============================================================================
/**
 * INTUITION:
 * To do this in O(N), we can't sort (which takes O(N log N)).
 * We use a Set for O(1) lookups.
 * The key insight is to only attempt to build a sequence from the *start* of
 * a sequence. A number `x` is the start if `x - 1` is NOT in the set.
 *
 * Time Complexity: O(N) - We visit each number at most twice (once in loop, once in while).
 * Space Complexity: O(N) - To store the set.
 */
var longestConsecutive = function (nums) {
  // 1. Handle Edge Case
  if (nums.length === 0) return 0;

  // 2. Create Set for O(1) Lookups
  // This removes duplicates automatically, which is fine.
  const numSet = new Set(nums);

  let maxStreak = 0;

  for (let num of numSet) {
    // 3. The Gatekeeper: Are you the START of a sequence?
    // We check if (num - 1) exists. If it does, we skip this number.
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;

      // 4. The Runner: Only runs for "Start" numbers
      while (numSet.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
      }

      maxStreak = Math.max(maxStreak, currentStreak);
    }
  }

  return maxStreak;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Longest Consecutive Sequence Tests ===\n");

console.log("Test 1:", longestConsecutive([100, 4, 200, 1, 3, 2])); // Expected: 4
console.log("Test 2:", longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // Expected: 9
console.log("Test 3:", longestConsecutive([])); // Expected: 0

module.exports = { longestConsecutive };
