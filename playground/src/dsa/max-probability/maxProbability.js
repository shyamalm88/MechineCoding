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
 * @param {number} nodeCount nodes are labelled 0 .. nodeCount - 1
 * @param {number[][]} edges each entry is [from, to] (undirected)
 * @param {number[]} edgeProbabilities success probability of edges[i]
 * @param {number} start
 * @param {number} end
 * @return {number} highest success probability, or 0 if no path exists
 *
 * Parameter ORDER matches LeetCode's
 * maxProbability(n, edges, succProb, start, end).
 */
function maxProbability(nodeCount, edges, edgeProbabilities, start, end) {
  // neighbours[node] = [[nextNode, probability], ...] -- pushed both ways
  // because the edges are undirected.
  const neighbours = Array.from({ length: nodeCount }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [from, to] = edges[i];
    const probability = edgeProbabilities[i];
    neighbours[from].push([to, probability]);
    neighbours[to].push([from, probability]);
  }

  // bestProbability[node] = best odds of arriving there. Starts at 0 (not
  // Infinity) because we are MAXIMISING, and 0 is the worst possible value.
  const bestProbability = Array(nodeCount).fill(0);
  bestProbability[start] = 1;

  // A MAX-heap: probabilities multiply, so the best path is the largest
  // product, not the smallest sum. That reversed comparator is the only real
  // difference from a textbook Dijkstra.
  const priorityQueue = new PriorityQueue((a, b) => a[0] > b[0]);
  priorityQueue.push([1, start]);

  while (priorityQueue.size() > 0) {
    const [probabilitySoFar, node] = priorityQueue.pop();

    // Best-first order means the first arrival at `end` is already optimal.
    if (node === end) return probabilitySoFar;

    // A better route to this node was queued later; this entry is stale.
    if (probabilitySoFar < bestProbability[node]) continue;

    for (const [nextNode, edgeProbability] of neighbours[node]) {
      const nextProbability = probabilitySoFar * edgeProbability;

      if (nextProbability > bestProbability[nextNode]) {
        bestProbability[nextNode] = nextProbability;
        priorityQueue.push([nextProbability, nextNode]);
      }
    }
  }

  return 0; // end was never reached
}

// ============================================================================
// TEST CASES
// ============================================================================
// LeetCode defines PriorityQueue; Node does not. Uncomment the reference
// class near the top to run these locally.
if (typeof PriorityQueue === "undefined") {
  console.log("PriorityQueue is not defined - uncomment the reference class above to run these tests.");
} else {
  console.log("=== Path with Maximum Probability Tests ===\n");

  const triangle = [[0, 1], [1, 2], [0, 2]];

  console.log("Test 1:", maxProbability(3, triangle, [0.5, 0.5, 0.2], 0, 2)); // Expected: 0.25 (via node 1)
  console.log("Test 2:", maxProbability(3, triangle, [0.5, 0.5, 0.3], 0, 2)); // Expected: 0.3  (direct wins)
  console.log("Test 3:", maxProbability(3, [[0, 1]], [0.5], 0, 2));           // Expected: 0    (unreachable)
  console.log("Test 4:", maxProbability(2, [[0, 1]], [1], 0, 1));             // Expected: 1
  console.log("Test 5:", maxProbability(2, [[0, 1]], [0.5], 0, 0));           // Expected: 1    (already there)
}

module.exports = { maxProbability };
