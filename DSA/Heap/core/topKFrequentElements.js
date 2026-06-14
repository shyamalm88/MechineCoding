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
 * - It is guaranteed that the answer is unique.
 */

// ============================================================================
// APPROACH: Min-Heap (Keep Top K)
// ============================================================================
/**
 * INTUITION:
 * We count the frequency of each number.
 * Then we iterate through the unique numbers and maintain a Min-Heap of size k
 * based on frequency.
 * If the heap size exceeds k, we remove the element with the smallest frequency.
 * The remaining elements in the heap are the k most frequent.
 *
 * Time Complexity: O(N log K)
 * Space Complexity: O(N + K)
 */
class MinHeap {
  constructor() {
    this.h = [];
  }
  size() {
    return this.h.length;
  }
  peek() {
    return this.h[0];
  }
  push(x) {
    this.h.push(x);
    let i = this.size() - 1;

    while (i > 0) {
      let parent = Math.floor((i - 1) / 2);
      // Compare frequencies (index 1)
      if (this.h[parent][1] <= this.h[i][1]) break;
      [this.h[parent], this.h[i]] = [this.h[i], this.h[parent]];
      i = parent;
    }
  }
  pop() {
    if (this.h.length === 1) return this.h.pop();

    const min = this.h[0];
    this.h[0] = this.h.pop();

    let i = 0;

    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let smallest = i;

      if (left < this.h.length && this.h[left][1] < this.h[smallest][1]) {
        smallest = left;
      }

      if (right < this.h.length && this.h[right][1] < this.h[smallest][1]) {
        smallest = right;
      }

      if (smallest === i) break;

      [this.h[i], this.h[smallest]] = [this.h[smallest], this.h[i]];
      i = smallest;
    }

    return min;
  }
}

const topKFrequent = (nums, k) => {
  const freq = new Map();

  // 1️⃣ Count frequencies
  for (let num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // 2️⃣ Min-heap of size k
  const heap = new MinHeap();

  for (let [num, count] of freq.entries()) {
    heap.push([num, count]);
    if (heap.size() > k) {
      heap.pop();
    }
  }

  // 3️⃣ Extract result
  const result = [];
  while (heap.size()) {
    result.push(heap.pop()[0]);
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Top K Frequent Elements (Heap) Tests ===\n");

console.log("Test 1:", topKFrequent([1, 1, 1, 2, 2, 3], 2)); // Expected: [1, 2] (order may vary)
console.log("Test 2:", topKFrequent([1], 1)); // Expected: [1]

module.exports = { topKFrequent };
