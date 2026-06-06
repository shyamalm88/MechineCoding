/**
 * ============================================================================
 * PROBLEM: Next Greater Element II (LeetCode #503)
 * ============================================================================
 * Given a circular integer array nums, return the next greater number for
 * every element. The next greater number of x is the first greater number
 * in traversal order (circularly). Return -1 if it doesn't exist.
 *
 * Example 1:
 * Input: nums=[1,2,1]
 * Output: [2,-1,2]
 * Explanation: 1→2, 2→no greater (only 1 after it circularly), 1→2
 *
 * Example 2:
 * Input: nums=[1,2,3,4,3]
 * Output: [2,3,4,-1,4]
 *
 * Constraints:
 * - 1 <= nums.length <= 10^4
 * - -10^9 <= nums[i] <= 10^9
 */

// ============================================================================
// APPROACH: Monotonic Stack — traverse 2N (double the array)
// ============================================================================
/**
 * STORY / INTUITION:
 * Circular means after the last element, we loop back to index 0.
 * Trick: Traverse indices 0..2N-1 using (i % n) to wrap around.
 * First pass (i < n): build the result.
 * Second pass (i >= n): resolve any remaining elements in the stack
 *   that couldn't find a greater element in the first traversal.
 *
 * Stack stores INDICES (not values). When we find a greater element,
 * pop all indices with smaller values and record the answer.
 *
 * DRY RUN (nums=[1,2,1], n=3, traverse 0..5):
 * i=0(1): stack=[] → push 0 → [0]
 * i=1(2): 2>nums[0]=1 → pop 0, res[0]=2. stack=[] → push 1 → [1]
 * i=2(1): 1 <= nums[1]=2 → push 2 → [1,2]
 * i=3(1): 1 <= nums[1]=2 → push 3→circular: i%3=0, push 0? No, only push i<n
 *         Actually we don't push for i >= n (only resolve)
 * i=3(1%3=0, val=1): 1 <= nums[2]=1 → nothing popped
 * i=4(4%3=1, val=2): 2 > nums[2]=1 → pop 2, res[2]=2. 2 <= nums[1]=2 → stop.
 * i=5(5%3=2, val=1): nothing popped. stack=[1] still there → res[1]=-1 (default)
 * Result: [2,-1,2] ✓
 *
 * Time:  O(N)
 * Space: O(N) for stack
 */
const nextGreaterElements = (nums) => {
  const n = nums.length;
  const res = new Array(n).fill(-1);
  const stack = []; // stores indices

  for (let i = 0; i < 2 * n; i++) {
    const val = nums[i % n];
    // Pop all stack entries whose value is less than current
    while (stack.length && nums[stack[stack.length - 1]] < val) {
      res[stack.pop()] = val;
    }
    // Only push indices from the first pass (avoid pushing duplicates in second pass)
    if (i < n) stack.push(i);
  }

  return res;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Next Greater Element II Tests ===\n");

console.log("Test 1:", nextGreaterElements([1, 2, 1]));       // Expected: [2, -1, 2]
console.log("Test 2:", nextGreaterElements([1, 2, 3, 4, 3])); // Expected: [2, 3, 4, -1, 4]
console.log("Test 3:", nextGreaterElements([5, 4, 3, 2, 1])); // Expected: [-1, 5, 5, 5, 5]

module.exports = { nextGreaterElements };
