/**
 * ============================================================================
 * PROBLEM: Bus Routes (LeetCode #815)
 * ============================================================================
 *
 * You are given an array routes representing bus routes where routes[i] is a
 * bus route that the ith bus repeats forever.
 *
 * For example, if routes[0] = [1, 5, 7], this means that the 0th bus travels
 * in the sequence 1 -> 5 -> 7 -> 1 -> 5 -> 7 -> ...
 *
 * You start at the bus stop source (You are not on any bus initially), and you
 * want to go to the bus stop target. You can travel between bus stops by buses
 * only.
 *
 * Return the least number of buses you must take to travel from source to
 * target. Return -1 if it is not possible.
 *
 * Example 1:
 * Input: routes = [[1,2,7],[3,6,7]], source = 1, target = 6
 * Output: 2
 * Explanation: The best strategy is take the first bus to the bus stop 7,
 *              then take the second bus to the bus stop 6.
 *
 * Example 2:
 * Input: routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12
 * Output: -1
 *
 * Constraints:
 * - 1 <= routes.length <= 500.
 * - 1 <= routes[i].length <= 10^5.
 * - All the values of routes[i] are unique.
 * - sum(routes[i].length) <= 10^5.
 * - 0 <= routes[i][j] < 10^6.
 * - 0 <= source, target < 10^6.
 *
 * ============================================================================
 * INTUITION: Breadth-First Search (BFS) on Routes
 * ============================================================================
 *
 * This is a shortest path problem in an unweighted graph.
 *
 * Key Insight:
 * - Instead of treating stops as nodes (which would create too many edges),
 *   we treat each BUS ROUTE as a node.
 * - Two routes are connected if they share a common stop.
 * - We want the shortest path from any route containing 'source' to any
 *   route containing 'target'.
 *
 * Algorithm:
 * 1. Build a map: Stop -> List of Routes passing through it.
 * 2. Use BFS to explore routes level by level.
 * 3. Start by adding all routes that contain the 'source' stop to the queue.
 * 4. For each route in the queue:
 *    a. Check all stops in this route.
 *    b. If a stop is 'target', return current bus count.
 *    c. Find all other routes connected to these stops.
 *    d. Add unvisited routes to the queue.
 * 5. Optimization: Keep track of visited stops to avoid checking the same
 *    transfer point multiple times.
 *
 * Time Complexity: O(N + S), where N is number of routes and S is total number of stops in all routes.
 * Space Complexity: O(N + S) for the map and queue.
 * ============================================================================
 */

/**
 * @param {number[][]} routes
 * @param {number} source
 * @param {number} target
 * @return {number}
 */
const numBusesToDestination = (routes, source, target) => {
  if (source === target) return 0;

  // Step 1: Build adjacency map (Stop -> Routes)
  const stopToRoutes = new Map();
  for (let i = 0; i < routes.length; i++) {
    for (let stop of routes[i]) {
      if (!stopToRoutes.has(stop)) {
        stopToRoutes.set(stop, []);
      }
      stopToRoutes.get(stop).push(i);
    }
  }

  // BFS Initialization
  const visitedRoutes = new Set();
  const visitedStops = new Set();
  const queue = [];

  // Add all routes containing the source stop
  const startingRoutes = stopToRoutes.get(source) || [];
  for (let routeIdx of startingRoutes) {
    queue.push(routeIdx);
    visitedRoutes.add(routeIdx);
  }

  let busCount = 1;

  while (queue.length > 0) {
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const currentRouteIdx = queue.shift();

      // Check all stops in the current route
      for (let stop of routes[currentRouteIdx]) {
        if (stop === target) return busCount;

        // Optimization: If we've already processed this stop for transfers, skip
        if (visitedStops.has(stop)) continue;
        visitedStops.add(stop);

        // Add connected routes (transfers)
        const connectedRoutes = stopToRoutes.get(stop) || [];
        for (let nextRouteIdx of connectedRoutes) {
          if (!visitedRoutes.has(nextRouteIdx)) {
            visitedRoutes.add(nextRouteIdx);
            queue.push(nextRouteIdx);
          }
        }
      }
    }
    busCount++;
  }

  return -1;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Standard case
console.log(
  "Test 1:",
  numBusesToDestination(
    [
      [1, 2, 7],
      [3, 6, 7],
    ],
    1,
    6
  )
);
// Expected: 2 (1->7 (Bus 0), 7->6 (Bus 1))

// Test 2: Impossible destination
console.log(
  "Test 2:",
  numBusesToDestination(
    [[7, 12], [4, 5, 15], [6], [15, 19], [9, 12, 13]],
    15,
    12
  )
);
// Expected: -1

// Test 3: Source equals Target
console.log(
  "Test 3:",
  numBusesToDestination(
    [
      [1, 2, 7],
      [3, 6, 7],
    ],
    1,
    1
  )
);
// Expected: 0

// Test 4: Direct bus
console.log(
  "Test 4:",
  numBusesToDestination(
    [
      [1, 2, 7],
      [3, 6, 7],
    ],
    1,
    7
  )
);
// Expected: 1

// Test 5: Three buses
console.log(
  "Test 5:",
  numBusesToDestination(
    [
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    1,
    4
  )
);
// Expected: 3
