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
