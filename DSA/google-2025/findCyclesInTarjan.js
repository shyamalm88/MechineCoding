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

      if (scc.length > 1) {
        sccs.push(scc);
      }
    }
  }

  for (const node of graph.keys()) {
    if (!indices.has(node)) {
      dfs(node);
    }
  }

  return sccs; // each SCC is a cycle
}

// ============================================================================
// APPROACH 2: Topological Sort (Kahn's Algorithm)
// ============================================================================
/**
 * INTUITION:
 * Topological Sort works by repeatedly removing nodes with Indegree 0.
 * - If we can remove all nodes, the graph is a DAG (No cycles).
 * - If nodes remain with Indegree > 0, those nodes form cycles.
 *
 * This function returns the topological order if possible, or null if a cycle exists.
 *
 * `fixCycles` attempts to break cycles by removing an arbitrary edge from a
 * node that still has neighbors when the sort fails.
 * NOTE: This is a heuristic/greedy fix, not necessarily optimal for minimum
 * edge removal (Feedback Arc Set is NP-Hard).
 */
function topologicalSort(graph) {
  const indegree = new Map();

  for (const node of graph.keys()) {
    indegree.set(node, 0);
  }

  for (const [u, neighbors] of graph.entries()) {
    for (const v of neighbors) {
      indegree.set(v, indegree.get(v) + 1);
    }
  }

  const queue = [];
  for (const [node, deg] of indegree.entries()) {
    if (deg === 0) queue.push(node);
  }

  const order = [];

  while (queue.length) {
    const node = queue.shift();
    order.push(node);

    for (const nei of graph.get(node) || []) {
      indegree.set(nei, indegree.get(nei) - 1);
      if (indegree.get(nei) === 0) {
        queue.push(nei);
      }
    }
  }

  return order.length === graph.size ? order : null;
}

function fixCycles(graph) {
  let order = topologicalSort(graph);
  if (order) return order;

  // Cycle exists → remove one edge arbitrarily
  for (const [u, neighbors] of graph.entries()) {
    if (neighbors.length > 0) {
      const v = neighbors.pop(); // break dependency u → v
      console.log(`Breaking dependency ${u} -> ${v}`);
      break;
    }
  }

  return fixCycles(graph);
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Tarjan & Cycle Tests ===\n");

// Graph: 0 -> 1 -> 2 -> 0 (Cycle)
const g1 = new Map();
g1.set(0, [1]);
g1.set(1, [2]);
g1.set(2, [0]);

console.log("Tarjan SCCs:", findCyclesTarjan(g1));
// Expected: [[2, 1, 0]] (order within SCC may vary)

// Graph: 0 -> 1, 2 -> 3 (No cycles)
const g2 = new Map();
g2.set(0, [1]);
g2.set(1, []);
g2.set(2, [3]);
g2.set(3, []);

console.log("Tarjan SCCs (No Cycle):", findCyclesTarjan(g2));
// Expected: [[1], [0], [3], [2]] (Single node SCCs)
