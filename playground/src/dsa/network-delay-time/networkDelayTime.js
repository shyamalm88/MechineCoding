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
  const priorityQueue = new PriorityQueue((a, b) => a[0] < b[0]);
  priorityQueue.push([0, startNode]);

  while (priorityQueue.size() > 0) {
    const [timeSoFar, node] = priorityQueue.pop();

    // A faster route to this node was queued later; this entry is stale.
    if (timeSoFar > earliestArrival[node]) continue;

    for (const [nextNode, travelTime] of outgoingEdges[node]) {
      const arrivalTime = timeSoFar + travelTime;

      if (arrivalTime < earliestArrival[nextNode]) {
        earliestArrival[nextNode] = arrivalTime;
        priorityQueue.push([arrivalTime, nextNode]);
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
// LeetCode defines PriorityQueue; Node does not. Uncomment the reference
// class near the top to run these locally.
if (typeof PriorityQueue === "undefined") {
  console.log("PriorityQueue is not defined - uncomment the reference class above to run these tests.");
} else {
  console.log("=== Network Delay Time Tests ===\n");

  console.log("Test 1:", networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2)); // Expected: 2
  console.log("Test 2:", networkDelayTime([[1, 2, 1]], 2, 1));                        // Expected: 1
  console.log("Test 3:", networkDelayTime([[1, 2, 1]], 2, 2));                        // Expected: -1 (1 unreachable)
  console.log("Test 4:", networkDelayTime([], 1, 1));                                 // Expected: 0 (already there)
  console.log("Test 5:", networkDelayTime([[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1));  // Expected: 3 (via 2, not direct)
}

module.exports = { networkDelayTime };
