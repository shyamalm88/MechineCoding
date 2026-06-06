/**
 * ============================================================================
 * PROBLEM: Interval List Intersections (LeetCode #986)
 * ============================================================================
 * Given two lists of closed intervals firstList and secondList (both sorted,
 * disjoint within each list), return the intersection of these two lists.
 *
 * Example 1:
 * Input: firstList=[[0,2],[5,10],[13,23],[24,25]]
 *        secondList=[[1,5],[8,12],[15,24],[25,26]]
 * Output: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]
 *
 * Example 2:
 * Input: firstList=[[1,3],[5,9]], secondList=[]
 * Output: []
 *
 * Constraints:
 * - 0 <= firstList.length, secondList.length <= 1000
 * - firstList[i].length == secondList[j].length == 2
 * - 0 <= start_i < end_i <= 10^9
 */

// ============================================================================
// APPROACH: Two Pointers — one per list
// ============================================================================
/**
 * STORY / INTUITION:
 * Two sorted lists, each non-overlapping within itself. Use two pointers i, j.
 * At each step, check if the current pair [A[i], B[j]] intersects:
 *   intersection = [max(A[i].start, B[j].start), min(A[i].end, B[j].end)]
 *   Valid only if start <= end.
 *
 * KEY DECISION — which pointer to advance?
 * Always advance the pointer whose interval ends EARLIER.
 * That interval can no longer intersect with anything beyond the current partner.
 *
 * DRY RUN:
 * A=[[0,2],[5,10]], B=[[1,5],[8,12]]
 * i=0,j=0: A=[0,2],B=[1,5] → intersect=[1,2] ✓ → A ends at 2 < 5, advance i
 * i=1,j=0: A=[5,10],B=[1,5] → intersect=[5,5] ✓ → B ends at 5 < 10, advance j
 * i=1,j=1: A=[5,10],B=[8,12] → intersect=[8,10] ✓ → A ends at 10 < 12, advance i
 * i=2: done.
 * Result: [[1,2],[5,5],[8,10]]
 *
 * Time:  O(M + N)
 * Space: O(M + N) for output
 */
const intervalIntersection = (firstList, secondList) => {
  const result = [];
  let i = 0, j = 0;

  while (i < firstList.length && j < secondList.length) {
    const [aStart, aEnd] = firstList[i];
    const [bStart, bEnd] = secondList[j];

    const start = Math.max(aStart, bStart);
    const end = Math.min(aEnd, bEnd);

    if (start <= end) result.push([start, end]); // valid intersection

    // Advance the pointer with the smaller end (it's exhausted)
    if (aEnd < bEnd) i++;
    else j++;
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Interval List Intersections Tests ===\n");

console.log("Test 1:", JSON.stringify(intervalIntersection(
  [[0, 2], [5, 10], [13, 23], [24, 25]],
  [[1, 5], [8, 12], [15, 24], [25, 26]]
))); // Expected: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]

console.log("Test 2:", JSON.stringify(intervalIntersection(
  [[1, 3], [5, 9]], []
))); // Expected: []

module.exports = { intervalIntersection };
