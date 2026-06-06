/**
 * ============================================================================
 * PROBLEM: Contiguous Array (LeetCode #525)
 * ============================================================================
 * Given a binary array nums, return the maximum length of a contiguous subarray
 * with an equal number of 0s and 1s.
 *
 * Example 1:
 * Input: nums=[0,1]     → Output: 2
 * Example 2:
 * Input: nums=[0,1,0]   → Output: 2  ([0,1] or [1,0])
 * Example 3:
 * Input: nums=[0,1,1,0] → Output: 4
 *
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - nums[i] is either 0 or 1
 */

// ============================================================================
// APPROACH: Prefix Sum + HashMap (transform 0→-1, find zero-sum subarray)
// ============================================================================
/**
 * STORY / INTUITION:
 * Replace each 0 with -1. Now "equal 0s and 1s" ≡ "sum of subarray = 0".
 * Use prefix sum: sum(i..j) = prefixSum[j] - prefixSum[i-1].
 * We want sum(i..j) = 0 → prefixSum[j] = prefixSum[i-1].
 *
 * TRICK: If we see the SAME prefix sum again at a later index, the subarray
 * between those two points has sum = 0 → equal 0s and 1s.
 *
 * Store {prefixSum → first index where it appeared} in a hashmap.
 * At each index, if we've seen this prefix sum before → compute length.
 *
 * Base: store {0: -1} (prefix sum 0 at "index -1", before the array starts).
 * This handles subarrays starting from index 0.
 *
 * DRY RUN: nums=[0,1,1,0] → transformed=[-1,1,1,-1]
 * map={0:-1}, sum=0
 * i=0: sum=-1. Not in map. map={0:-1, -1:0}
 * i=1: sum=0.  In map! length=1-(-1)=2. maxLen=2. map unchanged.
 * i=2: sum=1.  Not in map. map={0:-1,-1:0,1:2}
 * i=3: sum=0.  In map at -1! length=3-(-1)=4. maxLen=4.
 * Result: 4 ✓
 *
 * Time:  O(N)
 * Space: O(N)
 */
const findMaxLength = (nums) => {
  const map = new Map([[0, -1]]); // prefixSum → first seen index
  let sum = 0;
  let maxLen = 0;

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i] === 1 ? 1 : -1; // transform 0 → -1

    if (map.has(sum)) {
      maxLen = Math.max(maxLen, i - map.get(sum));
    } else {
      map.set(sum, i); // only store FIRST occurrence
    }
  }

  return maxLen;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Contiguous Array Tests ===\n");

console.log("Test 1:", findMaxLength([0, 1]));       // Expected: 2
console.log("Test 2:", findMaxLength([0, 1, 0]));    // Expected: 2
console.log("Test 3:", findMaxLength([0, 1, 1, 0])); // Expected: 4
console.log("Test 4:", findMaxLength([0, 0, 0, 1])); // Expected: 2

module.exports = { findMaxLength };
