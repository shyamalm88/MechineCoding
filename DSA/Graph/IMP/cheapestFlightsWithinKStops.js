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
 * State = (city, flightsUsed)
 *
 * Distance:
 *   cheapestCost[city][flightsUsed] = cheapest way to reach `city` having
 *   taken exactly `flightsUsed` flights
 *
 * We want:
 *   cheapest way to reach destination using <= maxFlights flights
 *
 * Note:
 * - k STOPS means k + 1 FLIGHTS -- the off-by-one that sinks most attempts,
 *   which is why the code names it `maxFlights` rather than reusing k
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
 * 1. Build adjacency list  (outboundFlights)
 * 2. Min-heap storing:
 *      [costSoFar, city, flightsUsed]
 * 3. cheapestCost[city][flightsUsed] tracks the best cost for that exact state
 * 4. Initialize:
 *      push [0, source, 0]
 * 5. While heap not empty:
 *      a. Pop cheapest state
 *      b. If city === destination → return costSoFar
 *      c. If flightsUsed === maxFlights → budget spent, skip
 *      d. Otherwise relax neighbours at flightsUsed + 1
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
 *   O(E × K log(V × K))
 *
 * Space:
 *   O(V × K) for the state table, plus the heap
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

// ============================================================================
// Min-heap ordered by cost. Written out here because these files are meant to
// run standalone under Node -- LeetCode's built-in PriorityQueue does not
// exist outside their judge, so relying on it leaves the file unrunnable.
// ============================================================================
class MinCostHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  /** Order is by cost alone -- the first element of each [cost, ...] tuple. */
  push(entry) {
    this.items.push(entry);
    let index = this.items.length - 1;

    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.items[parent][0] <= this.items[index][0]) break;
      [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
      index = parent;
    }
  }

  pop() {
    if (this.items.length === 0) return undefined;

    const cheapest = this.items[0];
    const last = this.items.pop();

    if (this.items.length > 0) {
      this.items[0] = last;
      let index = 0;

      for (;;) {
        const left = 2 * index + 1;
        const right = left + 1;
        let smallest = index;

        if (left < this.items.length && this.items[left][0] < this.items[smallest][0]) smallest = left;
        if (right < this.items.length && this.items[right][0] < this.items[smallest][0]) smallest = right;
        if (smallest === index) break;

        [this.items[smallest], this.items[index]] = [this.items[index], this.items[smallest]];
        index = smallest;
      }
    }

    return cheapest;
  }
}

/**
 * @param {number} cityCount   number of cities, labelled 0 .. cityCount - 1
 * @param {number[][]} flights each entry is [from, to, price]
 * @param {number} source      city to depart from
 * @param {number} destination city to reach
 * @param {number} maxStops    intermediate stops allowed (so maxStops + 1 flights)
 * @return {number} cheapest total price, or -1 if unreachable within the limit
 *
 * Parameter ORDER matches LeetCode's findCheapestPrice(n, flights, src, dst, k),
 * so this still pastes straight into the judge.
 */
function findCheapestPrice(cityCount, flights, source, destination, maxStops) {
  // "k stops" means k + 1 legs -- the off-by-one that sinks most attempts.
  const maxFlights = maxStops + 1;

  // outboundFlights[city] = [[nextCity, price], ...]
  const outboundFlights = Array.from({ length: cityCount }, () => []);
  for (const [from, to, price] of flights) {
    outboundFlights[from].push([to, price]);
  }

  // cheapestCost[city][flightsUsed] = best price seen for that exact STATE.
  // Two dimensions, not one: arriving at a city on 1 flight and on 3 flights
  // are different situations, and a plain visited[city] would wrongly discard
  // the second. A pricier route that used fewer flights can still be the only
  // one able to reach the destination in budget.
  const cheapestCost = Array.from({ length: cityCount }, () =>
    Array(maxFlights + 1).fill(Infinity),
  );
  cheapestCost[source][0] = 0;

  // Entries are [costSoFar, city, flightsUsed], cheapest first.
  const frontier = new MinCostHeap();
  frontier.push([0, source, 0]);

  while (frontier.size > 0) {
    const [costSoFar, city, flightsUsed] = frontier.pop();

    // Cheapest-first order means the first arrival at the destination is
    // already optimal among everything still within the flight budget.
    if (city === destination) return costSoFar;

    // Budget spent -- this state cannot legally be extended.
    if (flightsUsed === maxFlights) continue;

    // A cheaper route to this same state was queued after this one; this entry
    // is stale, and expanding it would only redo work.
    if (costSoFar > cheapestCost[city][flightsUsed]) continue;

    for (const [nextCity, price] of outboundFlights[city]) {
      const nextCost = costSoFar + price;
      const nextFlightsUsed = flightsUsed + 1;

      if (nextCost < cheapestCost[nextCity][nextFlightsUsed]) {
        cheapestCost[nextCity][nextFlightsUsed] = nextCost;
        frontier.push([nextCost, nextCity, nextFlightsUsed]);
      }
    }
  }

  return -1;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Cheapest Flights Within K Stops Tests ===\n");

const cheapFlights = [[0, 1, 100], [1, 2, 100], [2, 3, 100], [0, 3, 500]];

console.log("Test 1:", findCheapestPrice(4, cheapFlights, 0, 3, 1));
// Expected: 500 (the 3-leg route needs 2 stops, over the limit)

console.log("Test 2:", findCheapestPrice(4, cheapFlights, 0, 3, 2));
// Expected: 300 (0 → 1 → 2 → 3 now fits)

const threeCities = [[0, 1, 100], [1, 2, 100], [0, 2, 500]];

console.log("Test 3:", findCheapestPrice(3, threeCities, 0, 2, 1)); // Expected: 200
console.log("Test 4:", findCheapestPrice(3, threeCities, 0, 2, 0)); // Expected: 500 (direct only)

console.log("Test 5:", findCheapestPrice(2, [], 0, 1, 0));          // Expected: -1 (no flights)
console.log("Test 6:", findCheapestPrice(3, threeCities, 1, 1, 0)); // Expected: 0 (already there)
console.log("Test 7:", findCheapestPrice(3, [[0, 1, 100]], 0, 2, 5)); // Expected: -1 (unreachable)

// A cheap route that uses too many legs must lose to a pricier short one.
console.log("Test 8:", findCheapestPrice(
  5,
  [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [0, 4, 10]],
  0, 4, 2,
)); // Expected: 10 (the 1-per-leg chain needs 3 stops)

module.exports = { findCheapestPrice, MinCostHeap };
