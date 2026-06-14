/**
 * ============================================================================
 * PROBLEM: Find Strongly Connected Components (SCCs) / Cycles
 * ============================================================================
 * Given a directed graph, find all Strongly Connected Components.
 * An SCC is a subgraph where every vertex is reachable from every other vertex
 * in the subgraph.
 *
 * If an SCC has size > 1, or size == 1 with a self-loop, it represents a cycle.
 */

// ============================================================================
// APPROACH 1: Tarjan's Algorithm
// ============================================================================
/**
 * INTUITION:
 * Tarjan's algorithm uses DFS to find SCCs in linear time O(V+E).
 * It maintains:
 * 1. `indices`: Discovery time of each node.
 * 2. `lowlink`: The lowest discovery time reachable from the node (including via back-edges).
 * 3. `stack`: Nodes currently in the recursion stack.
 *
 * Key Logic:
 * - If we encounter a node already on the stack, it's a back-edge -> Cycle detected.
 * - We update `lowlink` based on neighbors.
 * - If `lowlink[u] == indices[u]`, then `u` is the root of an SCC.
 *   We pop elements from the stack until we hit `u`. These elements form the SCC.
 *
 * DRY RUN:
 * 0 -> 1 -> 0 (Cycle 0-1)
 *
 * 1. DFS(0). Index=0, Low=0. Stack=[0].
 * 2.   DFS(1). Index=1, Low=1. Stack=[0, 1].
 * 3.     Neighbor 0. On stack. Low[1] = min(Low[1], Index[0]) = 0.
 * 4.   Back to 1. Low[1] (0) != Index[1] (1).
 * 5. Back to 0. Low[0] = min(Low[0], Low[1]) = 0.
 * 6. Low[0] == Index[0]. Pop stack until 0. SCC: [1, 0].
 */
function findCyclesTarjan(graph) {
  let index = 0;
  const stack = [];
  const indices = new Map();
  const lowlink = new Map();
  const onStack = new Set();
  const sccs = [];

  function dfs(node) {
    indices.set(node, index);
    lowlink.set(node, index);
    index++;
    stack.push(node);
    onStack.add(node);

    for (const nei of graph.get(node) || []) {
      if (!indices.has(nei)) {
        dfs(nei);
        lowlink.set(node, Math.min(lowlink.get(node), lowlink.get(nei)));
      } else if (onStack.has(nei)) {
        lowlink.set(node, Math.min(lowlink.get(node), indices.get(nei)));
      }
    }

    // Found SCC root
    if (lowlink.get(node) === indices.get(node)) {
      const scc = [];
      let curr;
      do {
        curr = stack.pop();
        onStack.delete(curr);
        scc.push(curr);
      } while (curr !== node);

      // A size-1 SCC is only a "cycle" if it has a self-loop
      const hasSelfLoop = scc.length === 1 && (graph.get(node) || []).includes(node);
      if (scc.length > 1 || hasSelfLoop) {
        sccs.push(scc);
      }
    }
  }

  for (const node of graph.keys()) {
    if (!indices.has(node)) {
      dfs(node);
    }
  }

  return sccs; // each SCC of size > 1 (or with a self-loop) is a cycle
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Tarjan SCC / Cycle Detection Tests ===\n");

// Graph: 0 -> 1 -> 2 -> 0 (Cycle)
const g1 = new Map();
g1.set(0, [1]);
g1.set(1, [2]);
g1.set(2, [0]);

console.log("Test 1 (3-node cycle):", findCyclesTarjan(g1));
// Expected: [[2, 1, 0]] (order within SCC may vary)

// Graph: 0 -> 1, 2 -> 3 (No cycles, no self-loops)
const g2 = new Map();
g2.set(0, [1]);
g2.set(1, []);
g2.set(2, [3]);
g2.set(3, []);

console.log("Test 2 (DAG, no cycles):", findCyclesTarjan(g2));
// Expected: [] (every node is its own SCC, none has a self-loop)

// Graph: 0 -> 0 (self-loop), 1 -> 2, 2 -> []
const g3 = new Map();
g3.set(0, [0]);
g3.set(1, [2]);
g3.set(2, []);

console.log("Test 3 (self-loop counts as a cycle):", findCyclesTarjan(g3));
// Expected: [[0]]

module.exports = { findCyclesTarjan };
