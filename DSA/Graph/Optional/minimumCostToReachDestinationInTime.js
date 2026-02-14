/**
 * ============================================================================
 * PROBLEM: Minimum Cost to Reach Destination in Time (LeetCode #1928)
 * CATEGORY: 🟡 OPTIONAL (Dijkstra + State Pruning)
 * ============================================================================
 *
 * You are given:
 * - n cities labeled 0 to n-1
 * - edges[i] = [u, v, time]  (undirected)
 * - passingFees[i] = cost of visiting city i
 * - maxTime = maximum total time allowed
 *
 * You start at city 0 and want to reach city n-1.
 *
 * Goal:
 * - MINIMIZE total cost
 * - Subject to total time <= maxTime
 *
 * Return the minimum cost to reach destination within maxTime.
 * If impossible, return -1.
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   n = 5
 *   edges = [[0,1,10],[1,2,10],[2,3,10],[3,4,10],[0,4,50]]
 *   passingFees = [5,1,2,20,20]
 *   maxTime = 30
 *
 *   Path:
 *     0 → 1 → 2 → 3 → 4
 *   Time = 40 ❌ (too long)
 *
 *   Path:
 *     0 → 4
 *   Time = 50 ❌
 *
 *   Output: -1
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= n <= 1000
 * - 0 <= edges.length <= 10000
 * - 1 <= passingFees[i] <= 1000
 * - 1 <= maxTime <= 1000
 *
 * ============================================================================
 * INTUITION: Why This Is NOT Plain Dijkstra
 * ============================================================================
 *
 * In standard Dijkstra:
 *   - We minimize distance (or cost)
 *
 * Here:
 *   - We minimize COST
 *   - But TIME is a HARD CONSTRAINT
 *
 * Key Insight (CRITICAL):
 *
 *   Reaching the same city at different times
 *   leads to different future possibilities.
 *
 * So:
 *   (city = 3, time = 10) ≠ (city = 3, time = 25)
 *
 * A simple dist[city] is WRONG.
 *
 * ============================================================================
 * STATE MODELING
 * ============================================================================
 *
 * State = (city, timeSpent)
 *
 * We track:
 *   cost[city][time] = minimum cost to reach city
 *                      using exactly `time` time
 *
 * We want:
 *   min cost at (n-1, time <= maxTime)
 *
 * ============================================================================
 * ALGORITHM (Dijkstra with Pruning)
 * ============================================================================
 *
 * 1. Build adjacency list
 * 2. cost[city][time] initialized to Infinity
 * 3. Min-heap ordered by totalCost
 * 4. Start from (0, time=0, cost=passingFees[0])
 *
 * For each state popped:
 *   - If city == destination → return cost
 *   - Try all neighbors:
 *        newTime = time + edgeTime
 *        newCost = cost + passingFees[neighbor]
 *        if newTime <= maxTime AND newCost < cost[neighbor][newTime]:
 *            update and push
 *
 * Optimization:
 * - We prune worse states aggressively
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - V = cities
 * - E = edges
 * - T = maxTime
 *
 * Time:  O(E × T log (V × T))
 * Space: O(V × T)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🟡 OPTIONAL
 * ============================================================================
 *
 * This problem is rare in interviews.
 *
 * It mainly tests:
 * - Multi-dimensional state reasoning
 * - Constraint-based shortest paths
 *
 * Great for depth, but not required for most roles.
 * ============================================================================
 */

function minCost(maxTime, edges, passingFees) {
  const n = passingFees.length;

  // -------------------------------
  // Build adjacency list
  // -------------------------------
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    graph[u].push([v, t]);
    graph[v].push([u, t]);
  }

  // -------------------------------
  // cost[city][time] = min cost
  // -------------------------------
  const cost = Array.from({ length: n }, () =>
    Array(maxTime + 1).fill(Infinity),
  );
  cost[0][0] = passingFees[0];

  // -------------------------------
  // Min-heap: [totalCost, city, time]
  // -------------------------------
  const pq = new PriorityQueue((a, b) => a[0] < b[0]);
  pq.push([passingFees[0], 0, 0]);

  // -------------------------------
  // Dijkstra with state pruning
  // -------------------------------
  while (pq.size() > 0) {
    const [currCost, city, timeSpent] = pq.pop();

    // Destination reached optimally
    if (city === n - 1) return currCost;

    // Skip stale entry
    if (currCost > cost[city][timeSpent]) continue;

    for (const [nei, travelTime] of graph[city]) {
      const newTime = timeSpent + travelTime;
      if (newTime > maxTime) continue;

      const newCost = currCost + passingFees[nei];
      if (newCost < cost[nei][newTime]) {
        cost[nei][newTime] = newCost;
        pq.push([newCost, nei, newTime]);
      }
    }
  }

  return -1;
}
