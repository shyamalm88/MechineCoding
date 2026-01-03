/**
 * ============================================================================
 * PROBLEM: Top K Frequent Elements (LeetCode #347)
 * ============================================================================
 * Given an integer array nums and an integer k, return the k most frequent elements.
 * You may return the answer in any order.
 *
 * Example 1:
 * Input: nums = [1,1,1,2,2,3], k = 2
 * Output: [1,2]
 *
 * Example 2:
 * Input: nums = [1], k = 1
 * Output: [1]
 *
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - k is in the range [1, the number of unique elements in the array].
 */

// ============================================================================
// APPROACH: Bucket Sort
// ============================================================================
/**
 * INTUITION:
 * Instead of sorting frequencies (O(N log N)), we can use the fact that
 * the maximum possible frequency is N (length of array).
 * 1. Count frequencies of each number.
 * 2. Create "buckets" where index i stores a list of numbers that appear i times.
 * 3. Iterate backwards from the last bucket (highest frequency) to collect k numbers.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
const topKFrequent = (nums, k) => {
  const freqMap = new Map();
  // 1. Count the frequency of each number
  for (let num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // 2. Create buckets where index = frequency
  // buckets[i] will contain a list of numbers that appeared exactly 'i' times.
  const buckets = Array(nums.length + 1)
    .fill(0)
    .map(() => []);

  for (let [num, freq] of freqMap.entries()) {
    buckets[freq].push(num);
  }

  const result = [];

  // 3. Iterate from the highest frequency bucket down to 1
  // Collect numbers until we have k elements.
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (let num of buckets[i]) {
      result.push(num);
      if (result.length === k) break;
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Top K Frequent Elements (Bucket Sort) Tests ===\n");

console.log("Test 1:", topKFrequent([1, 1, 1, 2, 2, 3], 2)); // Expected: [1, 2]
console.log("Test 2:", topKFrequent([1], 1)); // Expected: [1]

module.exports = { topKFrequent };
