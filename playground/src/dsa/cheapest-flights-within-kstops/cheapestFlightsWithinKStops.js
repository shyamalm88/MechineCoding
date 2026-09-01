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
