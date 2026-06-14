/**
 * ============================================================================
 * PROBLEM: Find the Duplicate Number (LeetCode #287)
 * ============================================================================
 * Given an array nums of n+1 integers where each integer is in [1, n],
 * exactly ONE number is repeated. Find it without modifying the array and O(1) space.
 *
 * Example 1:
 * Input: nums=[1,3,4,2,2] → Output: 2
 * Example 2:
 * Input: nums=[3,1,3,4,2] → Output: 3
 *
 * Constraints:
 * - 1 <= n <= 10^5
 * - nums.length == n + 1
 * - Each value in [1, n]
 * - Only one repeated number (may repeat more than twice)
 * - Must NOT modify array, must use O(1) extra space
 */

// ============================================================================
// APPROACH: Floyd's Cycle Detection (Linked List in Disguise)
// ============================================================================
/**
 * STORY / INTUITION:
 * Treat the array as an implicit linked list: value at index i = "next node" from i.
 * Index 0 → nums[0] → nums[nums[0]] → ...
 *
 * Because one value is repeated, two different indices point to the SAME next node.
 * This creates a CYCLE. The duplicate number is the ENTRANCE to the cycle.
 *
 * Floyd's Algorithm:
 * Phase 1: Find where slow and fast meet (inside the cycle).
 * Phase 2: Move one pointer to start (index 0), keep other at meeting point.
 *          Both move at speed 1. Where they meet = CYCLE ENTRANCE = duplicate.
 *
 * DRY RUN: nums=[1,3,4,2,2], n=4
 * Implicit list: 0→1→3→2→4→2→4→2... (cycle: 2→4→2)
 *
 * Phase 1: slow=0, fast=0
 * Step1: slow=nums[0]=1, fast=nums[nums[0]]=nums[1]=3
 * Step2: slow=nums[1]=3, fast=nums[nums[3]]=nums[2]=4
 * Step3: slow=nums[3]=2, fast=nums[nums[4]]=nums[2]=4
 * Step4: slow=nums[2]=4, fast=nums[nums[4]]=nums[2]=4 → MEET at 4
 *
 * Phase 2: slow=0 (reset), fast=4 (meeting point)
 * Step1: slow=nums[0]=1, fast=nums[4]=2
 * Step2: slow=nums[1]=3, fast=nums[2]=4
 * Step3: slow=nums[3]=2, fast=nums[4]=2 → MEET at 2 = duplicate ✓
 *
 * Time:  O(N)
 * Space: O(1)
 */
const findDuplicate = (nums) => {
  // Phase 1: Detect cycle (find meeting point inside cycle)
  let slow = nums[0];
  let fast = nums[0];

  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  // Phase 2: Find cycle entrance (= duplicate number)
  slow = nums[0]; // reset slow to start
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }

  return slow;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Find the Duplicate Number Tests ===\n");

console.log("Test 1:", findDuplicate([1, 3, 4, 2, 2])); // Expected: 2
console.log("Test 2:", findDuplicate([3, 1, 3, 4, 2])); // Expected: 3
console.log("Test 3:", findDuplicate([1, 1]));           // Expected: 1
console.log("Test 4:", findDuplicate([2, 2, 2, 2, 2])); // Expected: 2

module.exports = { findDuplicate };
