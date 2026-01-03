/**
 * ============================================================================
 * PROBLEM: Kth Largest Element in an Array (LeetCode #215)
 * ============================================================================
 * Given an integer array nums and an integer k, return the kth largest element
 * in the array.
 *
 * Note that it is the kth largest element in the sorted order, not the kth
 * distinct element.
 *
 * Example 1:
 * Input: nums = [3,2,1,5,6,4], k = 2
 * Output: 5
 *
 * Example 2:
 * Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
 * Output: 4
 *
 * Constraints:
 * - 1 <= k <= nums.length <= 10^5
 */

// ============================================================================
// APPROACH: Min-Heap
// ============================================================================
/**
 * INTUITION:
 * We maintain a Min-Heap of size k.
 * As we iterate through the array, we push elements into the heap.
 * If the heap size exceeds k, we pop the smallest element.
 * At the end, the root of the heap (the smallest of the top k) is the kth largest.
 *
 * Time Complexity: O(N log K)
 * Space Complexity: O(K)
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

    // Bubble up: Move the new element up until the heap property is restored
    while (i > 0) {
      let parent = Math.floor((i - 1) / 2);
      if (this.h[parent] <= this.h[i]) break;
      // Swap if parent is greater than child (Min-Heap property violated)
      [this.h[parent], this.h[i]] = [this.h[i], this.h[parent]];
      i = parent;
    }
  }
  pop() {
    if (this.h.length === 1) return this.h.pop();

    const min = this.h[0];
    // Move the last element to the root and bubble down
    this.h[0] = this.h.pop();

    let i = 0;

    // Bubble down: Swap with the smaller child until heap property is restored
    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let smallest = i;

      if (left < this.h.length && this.h[left] < this.h[smallest]) {
        smallest = left;
      }

      if (right < this.h.length && this.h[right] < this.h[smallest]) {
        smallest = right;
      }

      if (smallest === i) break;

      [this.h[i], this.h[smallest]] = [this.h[smallest], this.h[i]];
      i = smallest;
    }

    return min;
  }
}
const findKthLargest = (nums, k) => {
  const heap = new MinHeap();

  for (let num of nums) {
    // Add current number to the heap
    heap.push(num);
    // If heap size exceeds k, remove the smallest element.
    // This ensures the heap always contains the k largest elements seen so far.
    if (heap.size() > k) {
      heap.pop();
    }
  }
  return heap.peek();
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Kth Largest Element Tests ===\n");

console.log("Test 1:", findKthLargest([3, 2, 1, 5, 6, 4], 2)); // Expected: 5
console.log("Test 2:", findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // Expected: 4

module.exports = { findKthLargest };
