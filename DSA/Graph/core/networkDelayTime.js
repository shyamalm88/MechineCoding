/**
 * ============================================================================
 * PROBLEM: Network Delay Time (LeetCode #743)
 * CATEGORY: 🔵 CORE (Pure Dijkstra Baseline)
 * ============================================================================
 *
 * You are given a network of n nodes, labeled from 1 to n.
 * You are also given a list of travel times as directed edges times,
 * where times[i] = [u, v, w] represents a directed edge from node u to node v
 * with travel time w.
 *
 * You are given a starting node k.
 *
 * The signal starts from node k and travels through the network.
 *
 * Return the minimum time it takes for all nodes to receive the signal.
 * If it is impossible for all nodes to receive the signal, return -1.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   times = [[2,1,1],[2,3,1],[3,4,1]]
 *   n = 4, k = 2
 *
 *   Graph:
 *       2 → 1 (1)
 *       2 → 3 (1)
 *       3 → 4 (1)
 *
 *   Shortest times from node 2:
 *       2 → 1 = 1
 *       2 → 3 = 1
 *       2 → 4 = 2
 *
 *   Output: 2
 *
 * Example 2:
 *
 *   times = [[1,2,1]]
 *   n = 2, k = 1
 *   Output: 1
 *
 * Example 3:
 *
 *   times = [[1,2,1]]
 *   n = 2, k = 2
 *   Output: -1   (node 1 is unreachable)
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= n <= 100
 * - 1 <= times.length <= 6000
 * - 1 <= u, v <= n
 * - u != v
 * - 0 <= w <= 100
 * - All edge weights are NON-NEGATIVE
 *
 * ============================================================================
 * INTUITION: Single-Source Shortest Path (Dijkstra)
 * ============================================================================
 *
 * This is the textbook Dijkstra problem.
 *
 * What the problem is REALLY asking:
 * - From the start node k, what is the shortest time to reach every node?
 * - The answer is the MAX of these shortest times
 *
 * Key Insight:
 * - If even ONE node is unreachable, return -1
 * - Otherwise, the slowest (farthest) node determines the total delay
 *
 * Why Dijkstra works here:
 * - All edge weights are >= 0
 * - Once we pick the closest unvisited node, its shortest path is FINAL
 *
 * Mental Model:
 * - The signal spreads outward from node k
 * - It always expands to the closest reachable node next
 * - Distances only get larger as we move outward
 *
 * ============================================================================
 * ALGORITHM (Dijkstra with Min Heap)
 * ============================================================================
 *
 * 1. Build an adjacency list from the edge list
 * 2. Maintain a distance array:
 *      dist[i] = shortest known time to reach node i
 * 3. Initialize:
 *      dist[k] = 0
 *      all others = Infinity
 * 4. Use a MIN-HEAP priority queue storing:
 *      [currentDistance, node]
 * 5. While heap is not empty:
 *      a. Pop the node with the smallest distance
 *      b. If this distance is stale, skip
 *      c. Relax all outgoing edges
 * 6. After processing:
 *      - If any node is unreachable → return -1
 *      - Else return max(dist[1..n])
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Time:  O((V + E) log V)
 *   - Each edge relaxation pushes into heap
 *   - Heap operations cost log V
 *
 * Space: O(V + E)
 *   - Graph storage + distance array + heap
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔵 CORE
 * ============================================================================
 *
 * - This is the BASELINE Dijkstra problem
 * - Interviewers use it to check:
 *     ✔ Heap usage
 *     ✔ Relaxation logic
 *     ✔ Stale-entry handling
 *     ✔ Correct graph modeling
 *
 * If you cannot do this cleanly, harder Dijkstra variants WILL fail.
 * ============================================================================
 */

function networkDelayTime(times, n, k) {
  // -------------------------------
  // Build adjacency list
  // -------------------------------
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) {
    graph[u].push([v, w]);
  }

  // -------------------------------
  // Distance array
  // -------------------------------
  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0;

  // -------------------------------
  // Min-Heap Priority Queue
  // Stores [distance, node]
  // -------------------------------
  const pq = new PriorityQueue((a, b) => a[0] < b[0]);
  pq.push([0, k]);

  // -------------------------------
  // Dijkstra
  // -------------------------------
  while (pq.size() > 0) {
    const [currDist, node] = pq.pop();

    // Skip stale heap entries
    if (currDist > dist[node]) continue;

    for (const [nei, weight] of graph[node]) {
      const newDist = currDist + weight;

      if (newDist < dist[nei]) {
        dist[nei] = newDist;
        pq.push([newDist, nei]);
      }
    }
  }

  // -------------------------------
  // Compute answer
  // -------------------------------
  let maxTime = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxTime = Math.max(maxTime, dist[i]);
  }

  return maxTime;
}
