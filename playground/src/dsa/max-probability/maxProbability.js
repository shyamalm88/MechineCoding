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
  const frontier = new BinaryHeap((a, b) => b[0] - a[0]);
  frontier.push([1, start]);

  while (frontier.size > 0) {
    const [probabilitySoFar, node] = frontier.pop();

    // Best-first order means the first arrival at `end` is already optimal.
    if (node === end) return probabilitySoFar;

    // A better route to this node was queued later; this entry is stale.
    if (probabilitySoFar < bestProbability[node]) continue;

    for (const [nextNode, edgeProbability] of neighbours[node]) {
      const nextProbability = probabilitySoFar * edgeProbability;

      if (nextProbability > bestProbability[nextNode]) {
        bestProbability[nextNode] = nextProbability;
        frontier.push([nextProbability, nextNode]);
      }
    }
  }

  return 0; // end was never reached
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Path with Maximum Probability Tests ===\n");

const triangle = [[0, 1], [1, 2], [0, 2]];

console.log("Test 1:", maxProbability(3, triangle, [0.5, 0.5, 0.2], 0, 2)); // Expected: 0.25 (via node 1)
console.log("Test 2:", maxProbability(3, triangle, [0.5, 0.5, 0.3], 0, 2)); // Expected: 0.3  (direct wins)
console.log("Test 3:", maxProbability(3, [[0, 1]], [0.5], 0, 2));           // Expected: 0    (unreachable)
console.log("Test 4:", maxProbability(2, [[0, 1]], [1], 0, 1));             // Expected: 1
console.log("Test 5:", maxProbability(2, [[0, 1]], [0.5], 0, 0));           // Expected: 1    (already there)

module.exports = { maxProbability, BinaryHeap };
