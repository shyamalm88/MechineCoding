/**
 * ============================================================================
 * PROBLEM: Maximum Sum Circular Subarray (LeetCode #918)
 * ============================================================================
 * Given a circular integer array nums, return the maximum possible sum of a
 * non-empty subarray. The array is circular (end wraps to beginning).
 *
 * Example 1:
 * Input: nums=[1,-2,3,-2] → Output: 3  (subarray [3])
 * Example 2:
 * Input: nums=[5,-3,5] → Output: 10   (wrap-around: [5,5], skipping -3)
 * Example 3:
 * Input: nums=[-3,-2,-3] → Output: -2  (all negative, must take at least one)
 *
 * Constraints:
 * - n == nums.length
 * - 1 <= n <= 3 * 10^4
 * - -3 * 10^4 <= nums[i] <= 3 * 10^4
 */

// ============================================================================
// APPROACH: Kadane's twice — normal + circular case
// ============================================================================
/**
 * STORY / INTUITION:
 * Two possible cases for the maximum subarray:
 *
 * CASE 1: Subarray does NOT wrap around → standard Kadane's → maxSum
 *
 * CASE 2: Subarray WRAPS around the circular boundary.
 *   A wrap-around subarray = total - (some middle subarray we SKIP).
 *   To maximize the wrap-around sum, MINIMIZE the middle subarray we skip.
 *   So: wrapMax = total - minSubarraySum
 *   (use Kadane's to find the minimum subarray sum)
 *
 * Answer = max(maxSum, total - minSum)
 *
 * EDGE CASE: All numbers negative.
 *   minSum = total → total - minSum = 0 → we'd pick empty subarray.
 *   But we must pick at least one element → return maxSum (which is the least negative).
 *
 * DRY RUN: nums=[5,-3,5]
 * total=7
 * maxSum (Kadane): 5, then 5-3=2, then 2+5=7? max at each step: 5, 5, 7... Wait
 *   curMax=0, maxSum=-Inf
 *   5: curMax=max(5,0+5)=5, maxSum=5
 *   -3: curMax=max(-3,5-3)=2, maxSum=5
 *   5: curMax=max(5,2+5)=7, maxSum=7
 *   So maxSum=7 (whole array, no wrap needed here, total=7)
 * minSum (Kadane for min): 5,-3,5
 *   curMin=0, minSum=+Inf
 *   5: curMin=min(5,0+5)=5, minSum=5
 *   -3: curMin=min(-3,5-3)=2? wait min(-3,5+(-3))=min(-3,2)=-3. minSum=-3
 *   5: curMin=min(5,-3+5)=min(5,2)=2. minSum=-3
 * wrapMax = total - minSum = 7 - (-3) = 10
 * Answer = max(7, 10) = 10 ✓
 *
 * Time:  O(N)
 * Space: O(1)
 */
const maxSubarraySumCircular = (nums) => {
  let total = 0;
  let maxSum = -Infinity, curMax = 0;
  let minSum = Infinity,  curMin = 0;

  for (const num of nums) {
    total += num;

    curMax = Math.max(num, curMax + num);
    maxSum = Math.max(maxSum, curMax);

    curMin = Math.min(num, curMin + num);
    minSum = Math.min(minSum, curMin);
  }

  // If all numbers are negative, maxSum is the answer (can't use wrap)
  return maxSum > 0 ? Math.max(maxSum, total - minSum) : maxSum;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Maximum Sum Circular Subarray Tests ===\n");

console.log("Test 1:", maxSubarraySumCircular([1, -2, 3, -2])); // Expected: 3
console.log("Test 2:", maxSubarraySumCircular([5, -3, 5]));     // Expected: 10
console.log("Test 3:", maxSubarraySumCircular([-3, -2, -3]));   // Expected: -2
console.log("Test 4:", maxSubarraySumCircular([3, -1, 2, -1])); // Expected: 4

module.exports = { maxSubarraySumCircular };
