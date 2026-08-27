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
 * DRY RUN:
 * Input: nums = [1, 1, 1, 2, 2, 3], k = 2
 *
 * 1. Count Frequencies:
 *    - Map = {1: 3, 2: 2, 3: 1}
 *
 * 2. Fill Buckets (Index = Frequency):
 *    - buckets array size 7 (indices 0-6).
 *    - Process 1 (freq 3) -> buckets[3] = [1]
 *    - Process 2 (freq 2) -> buckets[2] = [2]
 *    - Process 3 (freq 1) -> buckets[1] = [3]
 *    - State: [ [], [3], [2], [1], [], [], [] ]
 *
 * 3. Gather Top K (Iterate backwards):
 *    - i=6, 5, 4: Empty.
 *    - i=3: Found [1]. Result = [1]. (Need 1 more)
 *    - i=2: Found [2]. Result = [1, 2]. (Limit k=2 reached)
 *    - Stop.
 *
 * Result: [1, 2]
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
  const buckets = Array.from({ length: nums.length + 1 }, () => []);

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
