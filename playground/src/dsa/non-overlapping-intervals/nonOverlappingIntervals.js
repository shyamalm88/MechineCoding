// ============================================================================
// APPROACH: Greedy (Sort by End Time)
// ============================================================================
/**
 * INTUITION:
 * To maximize the number of non-overlapping intervals we can keep (which minimizes
 * the number we remove), we should always pick the interval that ends *earliest*.
 * Why? Because finishing early leaves the most room for subsequent intervals.
 *
 * 1. Sort by End Time.
 * 2. Iterate: If current interval starts before the previous one ends, it's an overlap.
 *    We discard the current one (count++) because the previous one ended earlier (greedy choice).
 *
 * Time Complexity: O(N log N)
 * Space Complexity: O(log N) or O(N) depending on sort implementation.
 */
const nonOverlappingIntervals = (intervals) => {
  if (intervals.length === 0) return 0;
  let count = 0;
  let sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let prevEnd = sorted[0][1];

  for (let i = 1; i < sorted.length; i++) {
    let [start, end] = sorted[i];
    if (start < prevEnd) {
      count++;
    } else {
      prevEnd = end;
    }
  }
  return count;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Non-overlapping Intervals Tests ===\n");

console.log(
  "Test 1:",
  nonOverlappingIntervals([
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 3],
  ])
); // Expected: 1

console.log(
  "Test 2:",
  nonOverlappingIntervals([
    [1, 2],
    [1, 2],
    [1, 2],
  ])
); // Expected: 2

module.exports = { nonOverlappingIntervals };
