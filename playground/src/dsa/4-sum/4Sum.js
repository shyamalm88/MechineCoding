// ============================================================================
// APPROACH: Sort + Two Fixed Loops + Two Pointers (kSum reduction)
// ============================================================================
/**
 * STORY / INTUITION:
 * Same ladder as 3Sum, one rung higher. 3Sum fixes ONE number and reduces to
 * "two sum" with two pointers. 4Sum fixes TWO numbers (nested loops i, j) and
 * reduces to that SAME "two sum" two-pointer search for the remaining pair.
 *
 * Sort first so:
 *  - duplicates land next to each other (skip them at every level: i, j,
 *    left, right) to avoid duplicate quadruplets.
 *  - the two-pointer convergence is meaningful (sum increases with `left++`,
 *    decreases with `right--`).
 *
 * DRY RUN (sorted nums=[-2,-1,0,0,1,2], target=0):
 * i=0(-2): j=1(-1): left=2(0), right=5(2): sum=-1 < 0 → left++
 *                    left=3(0), right=5(2): sum=-1 < 0 → left++
 *                    left=4(1), right=5(2): sum=0 ✓  → [-2,-1,1,2]
 *          j=2(0):  left=3(0), right=5(2): sum=0 ✓  → [-2,0,0,2]
 *          j=3(0): skip (duplicate of j=2)
 * i=1(-1): j=2(0):  left=3(0), right=5(2): sum=1 > 0 → right--
 *                    left=3(0), right=4(1): sum=0 ✓  → [-1,0,0,1]
 * Result: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]] ✓
 *
 * Time:  O(N^3) - two nested loops + one two-pointer scan
 * Space: O(1) extra (ignoring output / sort space)
 */
const fourSum = (nums, target) => {
  const result = [];
  nums.sort((a, b) => a - b);
  const n = nums.length;

  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;

      let left = j + 1;
      let right = n - 1;

      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right];

        if (sum === target) {
          result.push([nums[i], nums[j], nums[left], nums[right]]);
          left++;
          right--;
          while (left < right && nums[left] === nums[left - 1]) left++;
          while (left < right && nums[right] === nums[right + 1]) right--;
        } else if (sum < target) {
          left++;
        } else {
          right--;
        }
      }
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== 4Sum Tests ===\n");

console.log("Test 1:", fourSum([1, 0, -1, 0, -2, 2], 0)); // Expected: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
console.log("Test 2:", fourSum([2, 2, 2, 2, 2], 8));       // Expected: [[2,2,2,2]]

module.exports = { fourSum };
