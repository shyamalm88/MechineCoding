/**
 * ============================================================================
 * PROBLEM: Rectangle Area II (LeetCode #850)
 * ============================================================================
 * We are given a list of (axis-aligned) rectangles. Each rectangle[i] = [x1, y1, x2, y2],
 * where (x1, y1) are the coordinates of the bottom-left corner, and (x2, y2) are the
 * coordinates of the top-right corner.
 *
 * Find the total area covered by all rectangles in the plane. Since the answer
 * may be too large, return it modulo 10^9 + 7.
 *
 * Example 1:
 * Input: rectangles = [[0,0,2,2],[1,0,2,3],[1,0,3,1]]
 * Output: 6
 *
 * Constraints:
 * - 1 <= rectangles.length <= 200
 * - rectanges[i].length = 4
 * - 0 <= x1, y1, x2, y2 <= 10^9
 */

// ============================================================================
// APPROACH: Coordinate Compression + Plane Sweep
// ============================================================================
/**
 * INTUITION:
 * The coordinates can be as large as 10^9, so we cannot create a grid or array
 * of that size. However, the number of rectangles is small (<= 200).
 * This suggests that the number of "interesting" x and y coordinates is small
 * (at most 2 * N).
 *
 * We can use "Coordinate Compression":
 * 1. Collect all unique x-coordinates and sort them. These define vertical strips.
 * 2. Collect all unique y-coordinates and sort them. These define horizontal strips.
 *
 * We can then use a "Plane Sweep" algorithm:
 * - Iterate through the sorted unique x-coordinates.
 * - For each interval [x_i, x_{i+1}], we determine which rectangles are "active"
 *   (i.e., cover this x-interval).
 * - For the active rectangles, we calculate the length of their union along the y-axis.
 * - Area += (x_{i+1} - x_i) * (covered_y_length).
 *
 * To efficiently calculate the covered y-length, we can map the y-coordinates to
 * indices (0, 1, 2...) and use a simple counter array since N is small.
 *
 * DRY RUN:
 * Rectangles: R1=[0,0,2,2], R2=[1,1,3,3]
 * Unique X: [0, 1, 2, 3]
 * Unique Y: [0, 1, 2, 3]
 *
 * Events (at x-index):
 * - x=0 (val 0): Add R1 (y: 0->2)
 * - x=1 (val 1): Add R2 (y: 1->3)
 * - x=2 (val 2): Remove R1 (y: 0->2)
 * - x=3 (val 3): Remove R2 (y: 1->3)
 *
 * Loop x from 0 to 2:
 *
 * 1. i=0 (Interval x: 0->1, Width: 1)
 *    - Process events at x-index 0: Add R1.
 *    - Active Y-intervals: [0,2] (count=1).
 *    - Covered Y len: (y[1]-y[0]) + (y[2]-y[1]) = (1-0) + (2-1) = 2.
 *    - Area += 1 * 2 = 2.
 *
 * 2. i=1 (Interval x: 1->2, Width: 1)
 *    - Process events at x-index 1: Add R2.
 *    - Active Y-intervals: [0,2] (count=1), [1,3] (count=1).
 *    - Overlap in [1,2] -> count=2.
 *    - Covered Y len: [0,1] (cnt 1) + [1,2] (cnt 2) + [2,3] (cnt 1)
 *      = 1 + 1 + 1 = 3.
 *    - Area += 1 * 3 = 3. Total Area = 5.
 *
 * 3. i=2 (Interval x: 2->3, Width: 1)
 *    - Process events at x-index 2: Remove R1.
 *    - Active Y-intervals: [1,3] (count=1).
 *    - Covered Y len: [1,2] + [2,3] = 2.
 *    - Area += 1 * 2 = 2. Total Area = 7.
 *
 * Result: 7.
 */
function rectangleArea(rectangles) {
  const MOD = 1e9 + 7;

  const xs = new Set();
  const ys = new Set();

  // Collect coordinates
  for (const [x1, y1, x2, y2] of rectangles) {
    xs.add(x1);
    xs.add(x2);
    ys.add(y1);
    ys.add(y2);
  }

  const xVals = [...xs].sort((a, b) => a - b);
  const yVals = [...ys].sort((a, b) => a - b);

  // Compression maps
  const xIndex = new Map();
  const yIndex = new Map();

  xVals.forEach((v, i) => xIndex.set(v, i));
  yVals.forEach((v, i) => yIndex.set(v, i));

  // Events: at each x, add/remove y-interval
  const events = Array.from({ length: xVals.length }, () => []);

  for (const [x1, y1, x2, y2] of rectangles) {
    const xi1 = xIndex.get(x1);
    const xi2 = xIndex.get(x2);
    const yi1 = yIndex.get(y1);
    const yi2 = yIndex.get(y2);

    events[xi1].push([yi1, yi2, 1]); // add
    events[xi2].push([yi1, yi2, -1]); // remove
  }

  // Active coverage on y-axis
  const count = Array(yVals.length).fill(0);

  let area = 0;

  for (let x = 0; x < xVals.length - 1; x++) {
    // Apply events at x
    for (const [y1, y2, delta] of events[x]) {
      for (let y = y1; y < y2; y++) {
        count[y] += delta;
      }
    }

    // Compute total covered y-length
    let coveredY = 0;
    for (let y = 0; y < yVals.length - 1; y++) {
      if (count[y] > 0) {
        coveredY += yVals[y + 1] - yVals[y];
      }
    }

    const width = xVals[x + 1] - xVals[x];
    // Use BigInt for intermediate calculation to avoid precision loss with large coordinates
    area = Number(
      (BigInt(area) + BigInt(coveredY) * BigInt(width)) % BigInt(MOD),
    );
  }

  return area;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Rectangle Area Tests ===\n");

// Test 1: Simple overlap
const t1 = [
  [0, 0, 2, 2],
  [1, 0, 2, 3],
  [1, 0, 3, 1],
];
console.log("Test 1:", rectangleArea(t1));
// Expected: 6

// Test 2: Two separate squares
const t2 = [[0, 0, 1000000000, 1000000000]];
console.log("Test 2 (Large):", rectangleArea(t2));
// Expected: 49 (10^18 % 10^9+7 = 49)

// Test 3: Nested rectangles
const t3 = [
  [0, 0, 3, 3],
  [1, 1, 2, 2],
];
console.log("Test 3:", rectangleArea(t3));
// Expected: 9 (Inner one doesn't add area)

// Test 4: Touching rectangles
const t4 = [
  [0, 0, 1, 1],
  [1, 0, 2, 1],
];
console.log("Test 4:", rectangleArea(t4));
// Expected: 2
