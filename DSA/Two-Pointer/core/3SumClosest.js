/**
 * ============================================================================
 * PROBLEM: 3Sum Closest (LeetCode #16)
 * ============================================================================
 * Given an integer array nums and an integer target, find three integers in
 * nums such that their sum is CLOSEST to target. Return that sum.
 * Assume exactly one solution exists.
 *
 * Example 1:
 * Input: nums=[-1,2,1,-4], target=1 → Output: 2  (-1+2+1=2, closest to 1)
 *
 * Example 2:
 * Input: nums=[0,0,0], target=1 → Output: 0
 *
 * Constraints:
 * - 3 <= nums.length <= 500
 * - -1000 <= nums[i] <= 1000
 * - -10^4 <= target <= 10^4
 */

// ============================================================================
// APPROACH: Sort + Two Pointers (extension of 3Sum)
// ============================================================================
/**
 * STORY / INTUITION:
 * Same setup as 3Sum (#15): fix one element, then two-pointer for the other two.
 * Instead of looking for sum==0, track the sum CLOSEST to target so far.
 * At each step: if sum < target → move left right (need bigger sum).
 *              if sum > target → move right left (need smaller sum).
 *              if sum == target → can't get closer, return immediately.
 *
 * DRY RUN: nums=[-4,-1,1,2] (sorted), target=1
 * i=0 (-4): l=1(-1), r=3(2): sum=-4-1+2=-3. diff=4. closest=-3. -3<1 → l++
 *           l=2(1), r=3(2): sum=-4+1+2=-1. diff=2. closest=-1. -1<1 → l++
 *           l>=r. next i.
 * i=1 (-1): l=2(1), r=3(2): sum=-1+1+2=2. diff=1. closest=2. 2>1 → r--
 *           l>=r. next i.
 * i=2 (1):  l=3(2), r=3(2): l>=r. done.
 * Result: 2 ✓
 *
 * Time:  O(N²)
 * Space: O(1)
 */
const threeSumClosest = (nums, target) => {
  nums.sort((a, b) => a - b);
  let closest = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1, right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (Math.abs(sum - target) < Math.abs(closest - target)) {
        closest = sum;
      }

      if (sum < target) left++;
      else if (sum > target) right--;
      else return sum; // exact match
    }
  }

  return closest;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== 3Sum Closest Tests ===\n");

console.log("Test 1:", threeSumClosest([-1, 2, 1, -4], 1)); // Expected: 2
console.log("Test 2:", threeSumClosest([0, 0, 0], 1));       // Expected: 0
console.log("Test 3:", threeSumClosest([1, 1, 1, 0], -100)); // Expected: 2

module.exports = { threeSumClosest };
