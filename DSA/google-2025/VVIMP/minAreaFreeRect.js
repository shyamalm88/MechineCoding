/**
 * ============================================================================
 * PROBLEM: Minimum Area Rectangle II (LeetCode #963)
 * ============================================================================
 * Given a set of distinct points in the plane, return the minimum area of any
 * rectangle formed from these points, with sides NOT necessarily parallel to
 * the x/y axes. If there isn't any rectangle, return 0.
 *
 * Example 1:
 * Input: points = [[1,2],[2,1],[1,0],[0,1]]
 * Output: 2.00000
 *
 * Example 2:
 * Input: points = [[0,1],[2,1],[1,1],[1,0],[2,2],[3,3]]
 * Output: 1.00000
 *
 * Example 3:
 * Input: points = [[0,3],[1,2],[3,1],[1,3],[2,1]]
 * Output: 0
 *
 * Constraints:
 * 1 <= points.length <= 50
 * points[i].length == 2
 * 0 <= xi, yi <= 4 * 10^4
 * All the given points are unique.
 */

// ============================================================================
// APPROACH: Group Diagonals by (Midpoint, Length)
// ============================================================================
/**
 * STORY / INTUITION:
 * A quadrilateral is a rectangle IFF its two diagonals have the SAME midpoint
 * AND the same length (this also covers squares). So instead of searching for
 * 4 points that form right angles directly, we look at every PAIR of points
 * as a candidate diagonal, and bucket pairs by `(midpoint, diagonalLength)`.
 *
 * Any two diagonals that land in the same bucket form a rectangle with their
 * 4 endpoints. If diagonal 1 is (a, c) and diagonal 2 is (b, d), the rectangle
 * is a -> b -> c -> d -> a, so the two adjacent side lengths are |a-b| and
 * |a-d|. Area = |a-b| * |a-d|.
 *
 * DRY RUN: points = [[1,2],[2,1],[1,0],[0,1]]
 *  Diagonal (1,2)-(1,0): midpoint=(1,1), length^2 = 0 + 4 = 4
 *  Diagonal (2,1)-(0,1): midpoint=(1,1), length^2 = 4 + 0 = 4
 *  Same bucket! a=(1,2), c=(1,0), b=(2,1), d=(0,1)
 *  side1 = dist(a,b) = dist((1,2),(2,1)) = sqrt(2)
 *  side2 = dist(a,d) = dist((1,2),(0,1)) = sqrt(2)
 *  area = sqrt(2) * sqrt(2) = 2 -> matches expected output
 *
 * PITFALL: side2 must be dist(a, d) — the OTHER diagonal's endpoint — not
 * dist(a, c), which is just the diagonal itself (and would give a wrong,
 * inflated area).
 *
 * Time:  O(N^2) pairs to bucket, O(N^2) worst case to compare within buckets
 *        -> O(N^2) typical, O(N^3) pathological (many collinear diagonals).
 * Space: O(N^2) for the bucket map.
 */
function minAreaFreeRect(points) {
  const map = new Map();
  let minArea = Infinity;

  const n = points.length;

  // Step 1: Bucket every pair (as a potential diagonal) by midpoint + length^2
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[j];

      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;

      const dx = x1 - x2;
      const dy = y1 - y2;
      const lenSq = dx * dx + dy * dy;

      const key = `${mx},${my},${lenSq}`;

      if (!map.has(key)) map.set(key, []);
      map.get(key).push([i, j]);
    }
  }

  // Step 2: Any two diagonals sharing a bucket form a rectangle
  for (const pairs of map.values()) {
    if (pairs.length < 2) continue;

    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        const [a, c] = pairs[i];
        const [b, d] = pairs[j];

        const [x1, y1] = points[a];
        const [x2, y2] = points[b];
        const [x4, y4] = points[d];

        // side1 = a-b, side2 = a-d (adjacent sides of rectangle a-b-c-d)
        const side1 = Math.hypot(x1 - x2, y1 - y2);
        const side2 = Math.hypot(x1 - x4, y1 - y4);

        const area = side1 * side2;
        if (area > 0) minArea = Math.min(minArea, area);
      }
    }
  }

  return minArea === Infinity ? 0 : minArea;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Minimum Area Rectangle II Tests ===\n");

console.log(
  "Test 1:",
  minAreaFreeRect([
    [1, 2],
    [2, 1],
    [1, 0],
    [0, 1],
  ]),
);
// Expected: ~2 (2.0000000000000004 due to floating point sqrt(2) * sqrt(2))

console.log(
  "Test 2 (axis-aligned 1x1 square + noise point):",
  minAreaFreeRect([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 2],
  ]),
);
// Expected: 1

console.log(
  "Test 3:",
  minAreaFreeRect([
    [0, 3],
    [1, 2],
    [3, 1],
    [1, 3],
    [2, 1],
  ]),
);
// Expected: 0 (no rectangle can be formed)

module.exports = { minAreaFreeRect };
