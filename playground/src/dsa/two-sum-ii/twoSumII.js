// ============================================================================
// APPROACH: Two Pointers — left and right converge
// ============================================================================
/**
 * STORY / INTUITION:
 * Sorted array is the perfect setup for two pointers.
 * Start with left=0, right=n-1 (smallest and largest).
 * If sum < target → need larger sum → move left RIGHT (increase smaller number)
 * If sum > target → need smaller sum → move right LEFT (decrease larger number)
 * If sum == target → found it!
 *
 * WHY THIS WORKS: At every step, the pair we're checking is the ONLY candidate
 * for the current left-right combination. Moving a pointer eliminates all pairs
 * that can't possibly work.
 *
 * DRY RUN: numbers=[2,7,11,15], target=9
 * l=0(2), r=3(15): sum=17 > 9 → r=2
 * l=0(2), r=2(11): sum=13 > 9 → r=1
 * l=0(2), r=1(7):  sum=9 == 9 → return [1,2] ✓
 *
 * Time:  O(N)
 * Space: O(1)
 */
const twoSum = (numbers, target) => {
  let left = 0, right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1]; // 1-indexed
    else if (sum < target) left++;
    else right--;
  }
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Two Sum II Tests ===\n");

console.log("Test 1:", twoSum([2, 7, 11, 15], 9)); // Expected: [1, 2]
console.log("Test 2:", twoSum([2, 3, 4], 6));       // Expected: [1, 3]
console.log("Test 3:", twoSum([-1, 0], -1));         // Expected: [1, 2]

module.exports = { twoSum };
