/**
 * ============================================================================
 * PROBLEM: Network Delay Time (LeetCode #743)
 * CATEGORY: 🔵 CORE (Pure Dijkstra Baseline)
 * ============================================================================
 *
 * You are given a network of n nodes, labeled from 1 to n.
 * You are also given a list of travel times as directed edges times,
 * where times[i] = [u, v, w] represents a directed edge from node u to node v
 * with travel time w.
 *
 * You are given a starting node k.
 *
 * The signal starts from node k and travels through the network.
 *
 * Return the minimum time it takes for all nodes to receive the signal.
 * If it is impossible for all nodes to receive the signal, return -1.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   times = [[2,1,1],[2,3,1],[3,4,1]]
 *   n = 4, k = 2
 *
 *   Graph:
 *       2 → 1 (1)
 *       2 → 3 (1)
 *       3 → 4 (1)
 *
 *   Shortest times from node 2:
 *       2 → 1 = 1
 *       2 → 3 = 1
 *       2 → 4 = 2
 *
 *   Output: 2
 *
 * Example 2:
 *
 *   times = [[1,2,1]]
 *   n = 2, k = 1
 *   Output: 1
 *
 * Example 3:
 *
 *   times = [[1,2,1]]
 *   n = 2, k = 2
 *   Output: -1   (node 1 is unreachable)
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= n <= 100
 * - 1 <= times.length <= 6000
 * - 1 <= u, v <= n
 * - u != v
 * - 0 <= w <= 100
 * - All edge weights are NON-NEGATIVE
 *
 * ============================================================================
 * INTUITION: Single-Source Shortest Path (Dijkstra)
 * ============================================================================
 *
 * This is the textbook Dijkstra problem.
 *
 * What the problem is REALLY asking:
 * - From the start node k, what is the shortest time to reach every node?
 * - The answer is the MAX of these shortest times
 *
 * Key Insight:
 * - If even ONE node is unreachable, return -1
 * - Otherwise, the slowest (farthest) node determines the total delay
 *
 * Why Dijkstra works here:
 * - All edge weights are >= 0
 * - Once we pick the closest unvisited node, its shortest path is FINAL
 *
 * Mental Model:
 * - The signal spreads outward from node k
 * - It always expands to the closest reachable node next
 * - Distances only get larger as we move outward
 *
 * ============================================================================
 * ALGORITHM (Dijkstra with Min Heap)
 * ============================================================================
 *
 * 1. Build an adjacency list from the edge list
 * 2. Maintain a distance array:
 *      earliestArrival[i] = soonest known time to reach node i
 * 3. Initialize:
 *      earliestArrival[startNode] = 0
 *      all others = Infinity
 * 4. Use a MIN-HEAP priority queue storing:
 *      [currentDistance, node]
 * 5. While heap is not empty:
 *      a. Pop the node with the smallest distance
 *      b. If this distance is stale, skip
 *      c. Relax all outgoing edges
 * 6. After processing:
 *      - If any node is unreachable → return -1
 *      - Else return max(earliestArrival[1..nodeCount])
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Time:  O((V + E) log V)
 *   - Each edge relaxation pushes into heap
 *   - Heap operations cost log V
 *
 * Space: O(V + E)
 *   - Graph storage + distance array + heap
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔵 CORE
 * ============================================================================
 *
 * - This is the BASELINE Dijkstra problem
 * - Interviewers use it to check:
 *     ✔ Heap usage
 *     ✔ Relaxation logic
 *     ✔ Stale-entry handling
 *     ✔ Correct graph modeling
 *
 * If you cannot do this cleanly, harder Dijkstra variants WILL fail.
 * ============================================================================
 */

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
