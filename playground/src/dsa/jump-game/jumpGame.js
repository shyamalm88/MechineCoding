// ============================================================================
// APPROACH: Greedy
// ============================================================================
/**
 * INTUITION:
 * We iterate through the array and keep track of the `maxReach` (the farthest index
 * we can currently reach).
 * If at any point the current index `i` is greater than `maxReach`, it means
 * we are stuck and cannot proceed further.
 * Otherwise, update `maxReach = max(maxReach, i + nums[i])`.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
const canJump = (nums) => {
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    // If we can't even reach this index
    if (i > maxReach) return false;

    // Update farthest reachable index
    maxReach = Math.max(maxReach, i + nums[i]);
  }

  return true;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Jump Game Tests ===\n");

console.log("Test 1:", canJump([2, 3, 1, 1, 4])); // Expected: true
console.log("Test 2:", canJump([3, 2, 1, 0, 4])); // Expected: false

module.exports = { canJump };
