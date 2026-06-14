/**
 * ============================================================================
 * PROBLEM: Subarray Sum Equals K (LeetCode #560)
 * ============================================================================
 * Given an array of integers nums and an integer k, return the total number
 * of subarrays whose sum equals to k.
 *
 * A subarray is a contiguous non-empty sequence of elements within an array.
 *
 * Example 1:
 * Input: nums = [1,1,1], k = 2
 * Output: 2
 *
 * Example 2:
 * Input: nums = [1,2,3], k = 3
 * Output: 2
 *
 * Constraints:
 * - 1 <= nums.length <= 2 * 10^4
 * - -1000 <= nums[i] <= 1000
 * - -10^7 <= k <= 10^7
 */

// ============================================================================
// APPROACH: Prefix Sum + HashMap
// ============================================================================
/**
 * INTUITION:
 * The sum of a subarray from index i to j is: Sum(i, j) = PrefixSum[j] - PrefixSum[i-1].
 * We want Sum(i, j) == k.
 * Rearranging: PrefixSum[j] - k = PrefixSum[i-1].
 *
 * As we iterate through the array (calculating current PrefixSum), we check if
 * (currentSum - k) exists in our map. If it does, it means there are subarrays
 * ending at the current index that sum to k.
 *
 * DRY RUN:
 * Input: nums = [1, 1, 1], k = 2
 *
 * 1. Initialize:
 *    - map = {0: 1} (Base case for subarray starting at index 0)
 *    - currentSum = 0, count = 0
 *
 * 2. i=0, num=1:
 *    - currentSum = 1
 *    - needed = 1 - 2 = -1. Map has -1? No.
 *    - map = {0: 1, 1: 1}
 *
 * 3. i=1, num=1:
 *    - currentSum = 2
 *    - needed = 2 - 2 = 0. Map has 0? Yes (freq: 1).
 *    - count += 1 -> count = 1. (Found subarray [1, 1])
 *    - map = {0: 1, 1: 1, 2: 1}
 *
 * 4. i=2, num=1:
 *    - currentSum = 3
 *    - needed = 3 - 2 = 1. Map has 1? Yes (freq: 1).
 *    - count += 1 -> count = 2. (Found subarray [1, 1])
 *    - map = {0: 1, 1: 1, 2: 1, 3: 1}
 *
 * Result: 2
 *
 * Time Complexity: O(N) - Single pass.
 * Space Complexity: O(N) - Map stores prefix sums.
 *
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  // 📖 The Logbook: Stores { OdometerReading : HowManyTimesSeen }
  const map = new Map();

  // START: We start at mile 0 before driving anywhere.
  map.set(0, 1);

  let currentSum = 0; // 🚗 The Odometer
  let count = 0; // 🏆 How many valid segments found

  for (let num of nums) {
    // Drive! Add distance to odometer.
    currentSum += num;

    // 🤔 THE QUESTION:
    // "To have driven exactly 'k' miles ending right here,
    // I must have been at (currentSum - k) in the past.
    // Is that number in my logbook?"
    const neededHistory = currentSum - k;

    if (map.has(neededHistory)) {
      // Yes! I was there before.
      // The number of times I was there = number of valid segments ending here.
      count += map.get(neededHistory);
    }

    // 📝 WRITE IN LOGBOOK:
    // Record that we have reached this odometer reading.
    map.set(currentSum, (map.get(currentSum) || 0) + 1);
  }

  return count;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Subarray Sum Equals K Tests ===\n");

console.log("Test 1:", subarraySum([1, 1, 1], 2)); // Expected: 2
console.log("Test 2:", subarraySum([1, 2, 3], 3)); // Expected: 2 ([1,2] and [3])
console.log("Test 3:", subarraySum([1, -1, 0], 0)); // Expected: 3 ([1,-1], [0], [1,-1,0])

module.exports = { subarraySum };
