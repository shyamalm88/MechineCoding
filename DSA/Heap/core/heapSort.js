/**
 * ============================================================================
 * PROBLEM: Heap Sort (Classic Algorithm — no LC#, foundational)
 * CATEGORY: 🔵 CORE (In-Place Sorting via Binary Max-Heap)
 * ============================================================================
 * Sort an array of numbers in ascending order using a binary max-heap,
 * in-place, without relying on a separate heap data structure.
 *
 * Example 1:
 * Input: [5,3,8,1,9,2] → Output: [1,2,3,5,8,9]
 *
 * Example 2:
 * Input: [1] → Output: [1]
 */

// ============================================================================
// APPROACH: Build Max-Heap, Then Repeatedly Extract the Max to the End
// ============================================================================
/**
 * STORY / INTUITION:
 * A binary heap can be stored implicitly inside a plain array: for index i,
 * its children live at 2i+1 and 2i+2. "Heapify" fixes the heap property at
 * one node by sinking it down if a child is larger.
 *
 * PHASE 1 — Build: heapify every internal node from the last parent up to
 * the root. After this, arr[0] is the LARGEST element (max-heap property).
 *
 * PHASE 2 — Extract: swap arr[0] (the max) with the last unsorted element,
 * shrink the "active heap" by one, and heapify the root again to restore the
 * property. Repeating this n-1 times leaves the array fully sorted, because
 * each extracted max lands in its correct final position at the end.
 *
 * DRY RUN: arr=[5,3,8,1,9,2]
 * Build max-heap -> [9,5,8,1,3,2]
 * Extract: swap(0,5) -> [2,5,8,1,3,9], heapify(0..4) -> [8,5,2,1,3 | 9]
 * Extract: swap(0,4) -> [3,5,2,1,8 | 9], heapify(0..3) -> [5,3,2,1 | 8,9]
 * Extract: swap(0,3) -> [1,3,2,5 | 8,9], heapify(0..2) -> [3,1,2 | 5,8,9]
 * Extract: swap(0,2) -> [2,1,3 | 5,8,9], heapify(0..1) -> [2,1 | 3,5,8,9]
 * Extract: swap(0,1) -> [1,2 | 3,5,8,9], heapify(0..0) -> [1,2,3,5,8,9]
 * Result: [1,2,3,5,8,9] ✓
 *
 * Time:  O(N log N) — build is O(N), N extractions each O(log N)
 * Space: O(1) — sorts in place (recursion stack O(log N) for heapify)
 */
const heapSort = (arr) => {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements one by one
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    heapify(arr, end, 0);
  }

  return arr;
};

// Sink the node at index `i` down until the max-heap property holds,
// considering only the first `size` elements as "in the heap".
function heapify(arr, size, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < size && arr[left] > arr[largest]) largest = left;
  if (right < size && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, size, largest);
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Heap Sort Tests ===\n");

console.log("Test 1:", heapSort([5, 3, 8, 1, 9, 2])); // Expected: [1,2,3,5,8,9]
console.log("Test 2:", heapSort([1])); // Expected: [1]
console.log("Test 3:", heapSort([4, 4, 2, 2, 1])); // Expected: [1,2,2,4,4]

module.exports = { heapSort };
