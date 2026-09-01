// ============================================================================
// Binary heap ordered by a comparator. Written out here because these files are
// meant to run standalone under Node -- LeetCode's built-in PriorityQueue
// exists only inside their judge, so depending on it leaves the file unrunnable.
// ============================================================================
class BinaryHeap {
  /** compare(a, b) < 0 means `a` comes out first. */
  constructor(compare) {
    this.items = [];
    this.compare = compare;
  }

  get size() {
    return this.items.length;
  }

  push(entry) {
    this.items.push(entry);
    let index = this.items.length - 1;

    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.compare(this.items[parent], this.items[index]) <= 0) break;
      [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
      index = parent;
    }
  }

  pop() {
    if (this.items.length === 0) return undefined;

    const top = this.items[0];
    const last = this.items.pop();

    if (this.items.length > 0) {
      this.items[0] = last;
      let index = 0;

      for (;;) {
        const left = 2 * index + 1;
        const right = left + 1;
        let best = index;

        if (left < this.items.length && this.compare(this.items[left], this.items[best]) < 0) best = left;
        if (right < this.items.length && this.compare(this.items[right], this.items[best]) < 0) best = right;
        if (best === index) break;

        [this.items[best], this.items[index]] = [this.items[index], this.items[best]];
        index = best;
      }
    }

    return top;
  }
}

/**
 * @param {number[][]} travelTimes each entry is [from, to, travelTime]
 * @param {number} nodeCount nodes are labelled 1 .. nodeCount
 * @param {number} startNode node the signal is sent from
 * @return {number} time for every node to receive it, or -1 if any cannot
 *
 * Parameter ORDER matches LeetCode's networkDelayTime(times, n, k).
 */
function networkDelayTime(travelTimes, nodeCount, startNode) {
  // Index 0 is unused: nodes are 1-based, so the array is sized nodeCount + 1
  // rather than shifting every label by one at each access.
  const outgoingEdges = Array.from({ length: nodeCount + 1 }, () => []);
  for (const [from, to, travelTime] of travelTimes) {
    outgoingEdges[from].push([to, travelTime]);
  }

  // earliestArrival[node] = soonest the signal can reach it.
  const earliestArrival = Array(nodeCount + 1).fill(Infinity);
  earliestArrival[startNode] = 0;

  // Entries are [timeSoFar, node], soonest first.
  const frontier = new BinaryHeap((a, b) => a[0] - b[0]);
  frontier.push([0, startNode]);

  while (frontier.size > 0) {
    const [timeSoFar, node] = frontier.pop();

    // A faster route to this node was queued later; this entry is stale.
    if (timeSoFar > earliestArrival[node]) continue;

    for (const [nextNode, travelTime] of outgoingEdges[node]) {
      const arrivalTime = timeSoFar + travelTime;

      if (arrivalTime < earliestArrival[nextNode]) {
        earliestArrival[nextNode] = arrivalTime;
        frontier.push([arrivalTime, nextNode]);
      }
    }
  }

  // The network is "done" only when the LAST node hears the signal, so the
  // answer is the maximum arrival time -- and any unreachable node makes it
  // impossible outright.
  let slowestArrival = 0;
  for (let node = 1; node <= nodeCount; node++) {
    if (earliestArrival[node] === Infinity) return -1;
    slowestArrival = Math.max(slowestArrival, earliestArrival[node]);
  }

  return slowestArrival;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Network Delay Time Tests ===\n");

console.log("Test 1:", networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2)); // Expected: 2
console.log("Test 2:", networkDelayTime([[1, 2, 1]], 2, 1));                        // Expected: 1
console.log("Test 3:", networkDelayTime([[1, 2, 1]], 2, 2));                        // Expected: -1 (1 unreachable)
console.log("Test 4:", networkDelayTime([], 1, 1));                                 // Expected: 0 (already there)
console.log("Test 5:", networkDelayTime([[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1));  // Expected: 3 (via 2, not direct)

module.exports = { networkDelayTime, BinaryHeap };
