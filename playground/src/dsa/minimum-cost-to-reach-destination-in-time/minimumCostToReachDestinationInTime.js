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
 * @param {number} maxTime total travel minutes allowed
 * @param {number[][]} edges each entry is [from, to, minutes] (undirected)
 * @param {number[]} passingFees fee charged for being in each city
 * @return {number} cheapest total fee from city 0 to the last city inside
 *   maxTime, or -1 if no such journey exists
 *
 * Parameter ORDER matches LeetCode's minCost(maxTime, edges, passingFees).
 */
function minCost(maxTime, edges, passingFees) {
  const cityCount = passingFees.length;

  // roadsFrom[city] = [[nextCity, minutes], ...] -- both directions, the roads
  // are undirected.
  const roadsFrom = Array.from({ length: cityCount }, () => []);
  for (const [from, to, minutes] of edges) {
    roadsFrom[from].push([to, minutes]);
    roadsFrom[to].push([from, minutes]);
  }

  // cheapestFee[city][timeSpent] = best fee for that exact STATE. Two
  // dimensions, not one: arriving somewhere cheaply but slowly and arriving
  // dearly but quickly are both worth keeping, since only one of them may
  // still fit inside maxTime later.
  const cheapestFee = Array.from({ length: cityCount }, () => Array(maxTime + 1).fill(Infinity));
  cheapestFee[0][0] = passingFees[0];

  // Entries are [feeSoFar, city, timeSpent], cheapest first.
  const priorityQueue = new PriorityQueue((a, b) => a[0] < b[0]);
  priorityQueue.push([passingFees[0], 0, 0]);

  while (priorityQueue.size() > 0) {
    const [feeSoFar, city, timeSpent] = priorityQueue.pop();

    // Cheapest-first order means the first arrival is already optimal among
    // everything still inside the time budget.
    if (city === cityCount - 1) return feeSoFar;

    // A cheaper route to this same state was queued later; this entry is stale.
    if (feeSoFar > cheapestFee[city][timeSpent]) continue;

    for (const [nextCity, minutes] of roadsFrom[city]) {
      const nextTime = timeSpent + minutes;
      if (nextTime > maxTime) continue; // over budget, abandon this branch

      const nextFee = feeSoFar + passingFees[nextCity];

      if (nextFee < cheapestFee[nextCity][nextTime]) {
        cheapestFee[nextCity][nextTime] = nextFee;
        priorityQueue.push([nextFee, nextCity, nextTime]);
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
  console.log("=== Minimum Cost to Reach Destination in Time Tests ===\n");

  const roads = [[0, 1, 10], [1, 2, 10], [2, 5, 10], [0, 3, 1], [3, 4, 10], [4, 5, 15]];
  const fees = [5, 1, 2, 20, 20, 3];

  console.log("Test 1:", minCost(30, roads, fees)); // Expected: 11 (0→1→2→5, exactly 30 min)
  console.log("Test 2:", minCost(29, roads, fees)); // Expected: 48 (cheap route now too slow)
  console.log("Test 3:", minCost(25, roads, fees)); // Expected: -1 (nothing fits)
  console.log("Test 4:", minCost(10, [[0, 1, 10]], [1, 2]));  // Expected: 3 (single road, exact fit)
  console.log("Test 5:", minCost(9, [[0, 1, 10]], [1, 2]));   // Expected: -1 (one minute short)
}

module.exports = { minCost };
