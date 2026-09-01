// ============================================================================
// SAMPLE PriorityQueue (reference only)
// ============================================================================
// LeetCode provides PriorityQueue for you, so the solution below just uses it.
// This is what it looks like, if you want to run the file locally with Node --
// uncomment this block and the tests at the bottom will execute.
//
// The comparator is a BOOLEAN "does a come before b", which is LeetCode's
// convention:  min-heap -> (a, b) => a[0] < b[0]
//              max-heap -> (a, b) => a[0] > b[0]
//
// class PriorityQueue {
//   constructor(comesFirst) {
//     this.heap = [];
//     this.comesFirst = comesFirst;
//   }
//
//   size() {
//     return this.heap.length;
//   }
//
//   push(entry) {
//     this.heap.push(entry);
//
//     // Bubble up while this entry outranks its parent.
//     let index = this.heap.length - 1;
//     while (index > 0) {
//       const parent = (index - 1) >> 1;
//       if (!this.comesFirst(this.heap[index], this.heap[parent])) break;
//       [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
//       index = parent;
//     }
//   }
//
//   pop() {
//     if (this.heap.length === 0) return undefined;
//
//     const top = this.heap[0];
//     const last = this.heap.pop();
//     if (this.heap.length === 0) return top;
//
//     // Move the last entry to the root and sink it back down.
//     this.heap[0] = last;
//     let index = 0;
//     for (;;) {
//       const left = 2 * index + 1;
//       const right = left + 1;
//       let best = index;
//       if (left < this.heap.length && this.comesFirst(this.heap[left], this.heap[best])) best = left;
//       if (right < this.heap.length && this.comesFirst(this.heap[right], this.heap[best])) best = right;
//       if (best === index) break;
//       [this.heap[best], this.heap[index]] = [this.heap[index], this.heap[best]];
//       index = best;
//     }
//
//     return top;
//   }
// }
// ============================================================================

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
  const priorityQueue = new PriorityQueue((a, b) => a[0] < b[0]);
  priorityQueue.push([0, source, 0]);

  while (priorityQueue.size() > 0) {
    const [costSoFar, city, flightsUsed] = priorityQueue.pop();

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
        priorityQueue.push([nextCost, nextCity, nextFlightsUsed]);
      }
    }
  }

  return -1;
}

// ============================================================================
// TEST CASES
// ============================================================================
// LeetCode defines PriorityQueue; Node does not. Uncomment the reference
// class near the top to run these locally.
if (typeof PriorityQueue === "undefined") {
  console.log("PriorityQueue is not defined - uncomment the reference class above to run these tests.");
} else {
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
}

module.exports = { findCheapestPrice };
