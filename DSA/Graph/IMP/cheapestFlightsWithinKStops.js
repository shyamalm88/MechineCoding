/**
 * ============================================================================
 * PROBLEM: Cheapest Flights Within K Stops (LeetCode #787)
 * CATEGORY: 🟢 IMPORTANT (State-Space Dijkstra / BFS Hybrid)
 * ============================================================================
 *
 * You are given:
 * - n cities labeled from 0 to n - 1
 * - flights[i] = [from, to, price]
 *
 * You are also given:
 * - src  → starting city
 * - dst  → destination city
 * - k    → maximum number of stops allowed
 *
 * Return the CHEAPEST price from src to dst with at most k stops.
 * If no such route exists, return -1.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   n = 4
 *   flights = [[0,1,100],[1,2,100],[2,3,100],[0,3,500]]
 *   src = 0, dst = 3, k = 1
 *
 *   Possible paths:
 *     0 → 3                cost = 500
 *     0 → 1 → 2 → 3        ❌ (2 stops, exceeds k)
 *
 *   Output: 500
 *
 * Example 2:
 *
 *   src = 0, dst = 3, k = 2
 *
 *   Path:
 *     0 → 1 → 2 → 3        cost = 300 ✅
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= n <= 100
 * - 0 <= flights.length <= 10000
 * - 0 <= price <= 10^4
 * - No negative prices
 *
 * ============================================================================
 * INTUITION: Why Plain Dijkstra FAILS Here
 * ============================================================================
 *
 * This is NOT a standard shortest-path problem.
 *
 * Why?
 * - You are NOT allowed to take arbitrary cheapest paths
 * - You are constrained by number of stops (k)
 *
 * Key Insight (VERY IMPORTANT):
 *
 *   Reaching the SAME city with DIFFERENT number of stops
 *   are DIFFERENT STATES.
 *
 * So:
 *   (city = 2, stops = 1)  ≠  (city = 2, stops = 3)
 *
 * A naive visited[city] is WRONG.
 *
 * ============================================================================
 * STATE MODELING (This Is the Core of the Problem)
 * ============================================================================
 *
 * State = (currentCity, stopsUsed)
 *
 * Distance:
 *   cost[city][stops] = minimum cost to reach `city` using `stops` flights
 *
 * We want:
 *   min cost to reach dst using <= k + 1 flights
 *
 * Note:
 * - k stops means k + 1 edges
 *
 * ============================================================================
 * ALGORITHM OPTIONS
 * ============================================================================
 *
 * Option 1: BFS-style (level by level, stops-based)
 * Option 2: Dijkstra-style with state expansion
 *
 * We use Dijkstra-style here because:
 * - Edge weights vary
 * - We want cheapest cost first
 *
 * ============================================================================
 * ALGORITHM (Dijkstra with State)
 * ============================================================================
 *
 * 1. Build adjacency list
 * 2. Min-heap storing:
 *      [totalCost, city, stopsUsed]
 * 3. cost[city][stops] tracks best cost for this exact state
 * 4. Initialize:
 *      push [0, src, 0]
 * 5. While heap not empty:
 *      a. Pop cheapest state
 *      b. If city == dst → return cost
 *      c. If stopsUsed > k → skip
 *      d. Relax neighbors with stopsUsed + 1
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - V = number of cities
 * - E = number of flights
 *
 * Time:
 *   O(E log (V × K))
 *
 * Space:
 *   O(V × K)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🟢 IMPORTANT
 * ============================================================================
 *
 * Interviewers are checking:
 * - Can you identify when `visited[node]` is invalid?
 * - Can you model state correctly?
 * - Can you control state explosion?
 *
 * This problem is the GATEWAY to all hard shortest-path questions.
 * ============================================================================
 */

function findCheapestPrice(n, flights, src, dst, k) {
  // -------------------------------
  // Build adjacency list
  // -------------------------------
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, price] of flights) {
    graph[u].push([v, price]);
  }

  // -------------------------------
  // cost[city][stops] = min cost
  // -------------------------------
  const cost = Array.from({ length: n }, () => Array(k + 2).fill(Infinity));
  cost[src][0] = 0;

  // -------------------------------
  // Min-Heap: [cost, city, stops]
  // -------------------------------
  const pq = new PriorityQueue((a, b) => a[0] < b[0]);
  pq.push([0, src, 0]);

  // -------------------------------
  // Dijkstra with state
  // -------------------------------
  while (pq.size() > 0) {
    const [currCost, city, stops] = pq.pop();

    // Destination reached with valid stops
    if (city === dst) return currCost;

    // Stop constraint violated
    if (stops > k) continue;

    // Skip stale entries
    if (currCost > cost[city][stops]) continue;

    for (const [nei, price] of graph[city]) {
      const nextCost = currCost + price;
      const nextStops = stops + 1;

      if (nextCost < cost[nei][nextStops]) {
        cost[nei][nextStops] = nextCost;
        pq.push([nextCost, nei, nextStops]);
      }
    }
  }

  return -1;
}
