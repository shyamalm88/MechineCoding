// ============================================================================
// APPROACH: Greedy — Sort by END, shoot at each balloon's end as late as possible
// ============================================================================
/**
 * STORY / INTUITION:
 * Sort balloons by their END position. Greedily shoot an arrow at the END of
 * the first balloon — this covers the maximum possible overlapping balloons
 * (any balloon that starts <= this end is burst by this arrow).
 *
 * When we find a balloon that STARTS after the current arrow position,
 * we need a NEW arrow. Set the new arrow at that balloon's end.
 *
 * WHY SORT BY END? Shooting at the end of a balloon is always at least as
 * good as shooting anywhere else — it maximizes the chance of hitting
 * subsequent balloons.
 *
 * DRY RUN: [[1,6],[2,8],[7,12],[10,16]] sorted by end:
 * arrow=6, arrows=1 (shoot at end of [1,6])
 * [2,8]: start=2 <= 6 → burst by arrow. Skip.
 * [7,12]: start=7 > 6 → new arrow at 12. arrows=2.
 * [10,16]: start=10 <= 12 → burst. Skip.
 * Result: 2 ✓
 *
 * Time:  O(N log N)
 * Space: O(1)
 */
const findMinArrowShots = (points) => {
  points.sort((a, b) => a[1] - b[1]); // sort by end position

  let arrows = 1;
  let arrowPos = points[0][1]; // shoot at end of first balloon

  for (let i = 1; i < points.length; i++) {
    // If this balloon starts after our arrow, we need a new arrow
    if (points[i][0] > arrowPos) {
      arrows++;
      arrowPos = points[i][1]; // shoot at end of this new balloon
    }
  }

  return arrows;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Minimum Arrows to Burst Balloons Tests ===\n");

console.log("Test 1:", findMinArrowShots([[10, 16], [2, 8], [1, 6], [7, 12]])); // Expected: 2
console.log("Test 2:", findMinArrowShots([[1, 2], [3, 4], [5, 6], [7, 8]]));    // Expected: 4
console.log("Test 3:", findMinArrowShots([[1, 2], [2, 3], [3, 4], [4, 5]]));    // Expected: 2
console.log("Test 4:", findMinArrowShots([[1, 2]]));                            // Expected: 1

module.exports = { findMinArrowShots };
