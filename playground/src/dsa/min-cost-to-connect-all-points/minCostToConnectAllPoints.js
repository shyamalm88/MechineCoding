// ============================================================================
// APPROACH: Prim's Algorithm (Minimum Spanning Tree)
// ============================================================================
/**
 * STORY / INTUITION:
 * Every pair of points has an edge (cost = Manhattan distance) — this is a
 * COMPLETE GRAPH with n*(n-1)/2 edges. "Connect all points with minimum
 * total cost, exactly one path between any two" is the textbook definition
 * of a MINIMUM SPANNING TREE (MST).
 *
 * PRIM'S ALGORITHM grows the MST one node at a time, like a wildfire
 * spreading from a starting point:
 *
 * - `minDist[v]` = the cheapest edge connecting `v` to the GROWING tree so
 *   far (starts at Infinity for everyone except the start node, which is 0).
 * - Repeat n times: pick the UNVISITED node `u` with the smallest
 *   `minDist[u]` — that's the cheapest way to extend the tree. Add its cost
 *   to the total, mark it visited.
 * - After adding `u`, RELAX every other unvisited node `v`: if the direct
 *   edge (u,v) is cheaper than `v`'s current best connection to the tree,
 *   update `minDist[v]`.
 *
 * Because the graph is complete (n <= 1000), the simple O(n^2) array-scan
 * version of Prim's (no heap needed) is fast enough: n iterations, each
 * doing an O(n) scan to pick the minimum and an O(n) relax pass.
 *
 * DRY RUN: points = [[3,12],[-2,5],[-4,1]]  (indices 0,1,2)
 * Pairwise Manhattan distances: d(0,1)=12, d(0,2)=18, d(1,2)=6
 *
 * minDist=[0,inf,inf], inMST=[F,F,F], total=0
 * Step 1: pick u=0 (minDist=0). inMST=[T,F,F]. total=0.
 *         relax: minDist[1]=min(inf,12)=12, minDist[2]=min(inf,18)=18
 * Step 2: pick u=1 (minDist=12, smaller than minDist[2]=18). inMST=[T,T,F]. total=12.
 *         relax: minDist[2]=min(18, d(1,2)=6)=6
 * Step 3: pick u=2 (minDist=6). inMST=[T,T,T]. total=12+6=18.
 *
 * Result: 18 ✓
 *
 * Time:  O(n^2) — n iterations, each with an O(n) "find min" + O(n) relax
 * Space: O(n) — minDist and inMST arrays
 */
const minCostConnectPoints = (points) => {
  const n = points.length;
  const inMST = new Array(n).fill(false);
  const minDist = new Array(n).fill(Infinity);
  minDist[0] = 0;

  let totalCost = 0;

  for (let i = 0; i < n; i++) {
    // Find the unvisited node with the smallest minDist
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!inMST[v] && (u === -1 || minDist[v] < minDist[u])) u = v;
    }

    inMST[u] = true;
    totalCost += minDist[u];

    // Relax: can we reach unvisited nodes more cheaply via u?
    for (let v = 0; v < n; v++) {
      if (!inMST[v]) {
        const dist =
          Math.abs(points[u][0] - points[v][0]) +
          Math.abs(points[u][1] - points[v][1]);
        if (dist < minDist[v]) minDist[v] = dist;
      }
    }
  }

  return totalCost;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Min Cost to Connect All Points Tests ===\n");

console.log(
  "Test 1:",
  minCostConnectPoints([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]])
); // Expected: 20

console.log("Test 2:", minCostConnectPoints([[3, 12], [-2, 5], [-4, 1]])); // Expected: 18

console.log("Test 3:", minCostConnectPoints([[0, 0]])); // Expected: 0 (single point, nothing to connect)

module.exports = { minCostConnectPoints };
