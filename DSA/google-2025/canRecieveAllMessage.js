/**
 * ============================================================================
 * PROBLEM: Network Delay Time (Alternative Implementation)
 * ============================================================================
 * Determine if all users receive message within K time.
 * This is functionally identical to `canReachAllUsers.js` but uses a Map
 * for the graph and a simple array sort for the priority queue.
 *
 * @param {number[][]} times - [from, to, time]
 * @param {number} n - number of users (1..n)
 * @param {number} source - starting user
 * @param {number} K - time limit
 * @return {boolean}
 */

// ============================================================================
// APPROACH: Dijkstra with Array-based Priority Queue
// ============================================================================
/**
 * INTUITION:
 * Standard Dijkstra.
 * - Graph built using Map<Node, Array<[Neighbor, Weight]>>.
 * - Priority Queue simulated using a standard array and sorting on every push/pop.
 *   (Note: Sorting the array makes each operation O(N log N), leading to O(E * N log N)
 *    overall, which is slower than binary heap O(E log N), but acceptable for small N).
 *
 * DRY RUN:
 * Times: [[1, 2, 1]], N=2, Source=1, K=1
 *
 * 1. Graph: { 1: [[2, 1]] }
 * 2. Dist: [Inf, 0, Inf] (1-based indexing)
 * 3. PQ: [[0, 1]]
 *
 * 4. Pop [0, 1].
 *    - Neighbor 2, weight 1.
 *    - New time = 0 + 1 = 1.
 *    - 1 < Inf. Dist[2] = 1. PQ: [[1, 2]].
 *
 * 5. Pop [1, 2]. No neighbors.
 *
 * 6. Check dists: [Inf, 0, 1].
 *    - Node 0 is unused (1-based).
 *    - Node 1: 0 <= K.
 *    - Node 2: 1 <= K.
 *    - Return true.
 */
function canAllReceiveMessage(times, n, source, K) {
  // Build adjacency list
  const graph = new Map();
  for (const [u, v, t] of times) {
    if (!graph.has(u)) graph.set(u, []);
    graph.get(u).push([v, t]);
  }

  // Distance array
  const dist = Array(n + 1).fill(Infinity);
  dist[source] = 0;

  // Min-heap (priority queue)
  const pq = [[0, source]]; // [time, node]

  while (pq.length) {
    // Extract min
    pq.sort((a, b) => a[0] - b[0]); // acceptable in interviews unless huge
    const [time, node] = pq.shift();

    if (time > dist[node]) continue;

    for (const [nei, wt] of graph.get(node) || []) {
      const newTime = time + wt;
      if (newTime < dist[nei]) {
        dist[nei] = newTime;
        pq.push([newTime, nei]);
      }
    }
  }

  // Check maximum time
  let maxTime = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return false;
    maxTime = Math.max(maxTime, dist[i]);
  }

  return maxTime <= K;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Can All Receive Message Tests ===\n");

// Test 1: Standard case
const t1 = [
  [2, 1, 1],
  [2, 3, 1],
  [3, 4, 1],
];
console.log("Test 1:", canAllReceiveMessage(t1, 4, 2, 2));
// Expected: true (2->1 is 1, 2->3->4 is 2. Max is 2)

// Test 2: Unreachable
const t2 = [[1, 2, 1]];
console.log("Test 2:", canAllReceiveMessage(t2, 2, 2, 1));
// Expected: false (Node 1 cannot be reached from 2)
