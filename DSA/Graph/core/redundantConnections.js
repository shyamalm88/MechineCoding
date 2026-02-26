/**
 * ============================================================================
 * PROBLEM: Redundant Connection (LeetCode #684)
 * CATEGORY: 🔵 CORE (Cycle Detection in Undirected Graph using Union-Find)
 * ============================================================================
 *
 * You are given an undirected graph that started as a tree with n nodes
 * (labeled 1 to n), but then ONE extra edge was added.
 *
 * The added edge creates a cycle.
 *
 * Your task:
 * - Find the edge that can be removed so that the graph becomes a tree again.
 * - If there are multiple answers, return the LAST edge that appears in input.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   edges = [[1,2],[1,3],[2,3]]
 *
 *   Graph:
 *       1
 *      / \
 *     2 - 3
 *
 *   Edge [2,3] creates a cycle → remove it
 *
 *   Output: [2,3]
 *
 * Example 2:
 *
 *   edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]
 *
 *   Output: [1,4]
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 3 <= edges.length <= 1000
 * - edges[i].length == 2
 * - 1 <= u, v <= edges.length
 * - Graph is connected
 *
 * ============================================================================
 * INTUITION: Tree + One Extra Edge
 * ============================================================================
 *
 * A tree has:
 * - No cycles
 * - Exactly n - 1 edges
 *
 * Here:
 * - We START with a tree
 * - We ADD exactly ONE extra edge
 *
 * Therefore:
 * - Exactly ONE cycle exists
 * - The redundant edge is the one that CLOSES the cycle
 *
 * Key Insight (VERY IMPORTANT):
 *
 *   When adding edges one by one:
 *   - If an edge connects two nodes that are ALREADY connected,
 *     it must be the redundant one.
 *
 * This is a textbook use-case for Union-Find.
 *
 * ============================================================================
 * WHY UNION-FIND IS PERFECT HERE
 * ============================================================================
 *
 * Union-Find maintains connected components dynamically.
 *
 * For each edge [u, v]:
 * - If u and v are in DIFFERENT components → safe edge
 * - If u and v are in SAME component → this edge creates a cycle
 *
 * Since the problem asks for the LAST such edge:
 * - We simply process edges in input order
 * - Return the first one that fails union
 *
 * ============================================================================
 * ALGORITHM (UNION-FIND)
 * ============================================================================
 *
 * 1. Initialize Union-Find for nodes 1..n
 *
 * 2. For each edge [u, v] in edges:
 *      - If find(u) === find(v):
 *           → This edge is redundant → return [u, v]
 *      - Else:
 *           → union(u, v)
 *
 * 3. Guaranteed one answer exists
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Time:
 *   O(n α(n)) ≈ O(n)
 *
 * Space:
 *   O(n)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔵 CORE
 * ============================================================================
 *
 * Interviewers are testing:
 * - Cycle detection in undirected graphs
 * - Practical understanding of Union-Find
 * - Ability to reason incrementally about graph construction
 *
 * This is one of the most common DSU questions at Google.
 * ============================================================================
 */

function findRedundantConnection(edges) {
  const graph = new Map();

  function dfs(curr, target, visited) {
    if (curr === target) return true;
    visited.add(curr);

    for (const nei of graph.get(curr) || []) {
      if (!visited.has(nei)) {
        if (dfs(nei, target, visited)) return true;
      }
    }
    return false;
  }

  for (const [u, v] of edges) {
    if (graph.has(u) && graph.has(v)) {
      if (dfs(u, v, new Set())) {
        return [u, v];
      }
    }

    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u).push(v);
    graph.get(v).push(u);
  }

  return [];
}
