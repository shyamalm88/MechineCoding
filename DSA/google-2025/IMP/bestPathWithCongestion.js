/**
 * ============================================================================
 * PROBLEM: Best Path with Dynamic Congestion
 * ============================================================================
 * Find the shortest path in a graph where edge weights are dynamic.
 * The cost of traversing an edge depends on its base cost and current load.
 *
 * Cost Formula: newCost = currentPathCost + baseCost * (1 + load / capacity)
 *
 * Note: This is a variation of Dijkstra's algorithm where the edge weight
 * is calculated at runtime based on simulation parameters.
 */

// ============================================================================
// APPROACH: Dijkstra's Algorithm
// ============================================================================
/**
 * INTUITION:
 * Since we want the minimum cost path and edge weights are non-negative,
 * Dijkstra is the standard choice.
 *
 * The twist is "congestion". When we traverse an edge in our simulation,
 * we increase its load. This models a scenario where routing traffic
 * increases the cost for subsequent packets (or just models the cost for
 * the current packet based on existing load).
 *
 * DRY RUN:
 * A -> B (Base: 10, Load: 0, Cap: 10)
 * A -> C (Base: 20, Load: 0, Cap: 10)
 *
 * 1. Start at A. Dist: {A: 0}. PQ: [{A, 0}]
 * 2. Pop A. Neighbors B, C.
 *    - To B: Cost = 0 + 10 * (1 + 0/10) = 10. Push {B, 10}. Load(A->B)++.
 *    - To C: Cost = 0 + 20 * (1 + 0/10) = 20. Push {C, 20}. Load(A->C)++.
 */
class MinHeap {
  constructor() {
    this.data = [];
  }
  push(item) {
    this.data.push(item);
    this.data.sort((a, b) => a.cost - b.cost);
  }
  pop() {
    return this.data.shift();
  }
  isEmpty() {
    return this.data.length === 0;
  }
}

/**
 * Dynamic routing with congestion
 */
function bestPathWithCongestion(graph, start, end) {
  const pq = new MinHeap();
  const dist = new Map();

  pq.push({ node: start, cost: 0 });
  dist.set(start, 0);

  while (!pq.isEmpty()) {
    const { node, cost } = pq.pop();

    if (node === end) return cost;
    if (cost > dist.get(node)) continue;

    for (const edge of graph[node]) {
      const { to, baseCost, load, capacity } = edge;

      // dynamic cost
      const congestionFactor = 1 + load / capacity;
      const newCost = cost + baseCost * congestionFactor;

      if (!dist.has(to) || newCost < dist.get(to)) {
        dist.set(to, newCost);
        pq.push({ node: to, cost: newCost });

        // simulate congestion increase
        edge.load += 1;
      }
    }
  }

  return Infinity;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Best Path with Congestion Tests ===\n");

const graph = {
  A: [
    { to: "B", baseCost: 10, load: 0, capacity: 10 },
    { to: "C", baseCost: 15, load: 5, capacity: 10 }, // Higher load initially
  ],
  B: [{ to: "D", baseCost: 10, load: 0, capacity: 10 }],
  C: [{ to: "D", baseCost: 10, load: 0, capacity: 10 }],
  D: [],
};

console.log("Cost A -> D:", bestPathWithCongestion(graph, "A", "D"));
// Path A->B->D:
// A->B: 10 * (1 + 0/10) = 10. Total 10.
// B->D: 10 * (1 + 0/10) = 10. Total 20.
// Path A->C->D:
// A->C: 15 * (1 + 5/10) = 15 * 1.5 = 22.5. Total 22.5.
// Result: 20

module.exports = { bestPathWithCongestion };
