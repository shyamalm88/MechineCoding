/**
 * ============================================================================
 * PROBLEM: Graph Valid Tree (LeetCode #261)
 * CATEGORY: 🔵 CORE (Graph Validity: Connectivity + Acyclic)
 * ============================================================================
 *
 * You are given:
 * - n nodes labeled from 0 to n - 1
 * - edges where edges[i] = [u, v] represents an undirected edge
 *
 * Determine whether these edges form a VALID TREE.
 *
 * A graph is a valid tree if:
 * 1) It is CONNECTED (all nodes reachable)
 * 2) It has NO CYCLES
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   n = 5
 *   edges = [[0,1],[0,2],[0,3],[1,4]]
 *
 *   This is a valid tree.
 *
 * Example 2:
 *
 *   n = 5
 *   edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
 *
 *   This graph has a cycle → NOT a tree.
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= n <= 2000
 * - 0 <= edges.length <= 5000
 * - Undirected graph
 *
 * ============================================================================
 * INTUITION: What Makes a Graph a Tree?
 * ============================================================================
 *
 * A tree has TWO fundamental properties:
 *
 *   (A) NO CYCLES
 *   (B) CONNECTED
 *
 * Either one failing → NOT a tree.
 *
 * Key Observation (VERY IMPORTANT):
 *
 *   For an undirected graph with n nodes:
 *     A tree MUST have exactly (n - 1) edges.
 *
 * Why?
 * - Fewer edges → disconnected
 * - More edges → cycle guaranteed
 *
 * BUT:
 * - edges == n - 1 is NECESSARY
 * - edges == n - 1 is NOT SUFFICIENT by itself
 *
 * We still need to verify connectivity / no cycles.
 *
 * ============================================================================
 * TWO CORRECT WAYS TO SOLVE
 * ============================================================================
 *
 * Option 1: DFS / BFS
 *   - Build adjacency list
 *   - DFS from node 0
 *   - Detect cycles using parent tracking
 *   - Ensure all nodes are visited
 *
 * Option 2: UNION-FIND (DSU)  ← interview favorite
 *   - Each edge connects two components
 *   - If an edge connects already-connected nodes → cycle
 *   - At the end, exactly one connected component must exist
 *
 * We’ll implement UNION-FIND (cleanest + most reusable).
 *
 * ============================================================================
 * ALGORITHM (UNION-FIND)
 * ============================================================================
 *
 * 1. If edges.length !== n - 1 → return false immediately
 *
 * 2. Initialize Union-Find with n nodes
 *
 * 3. For each edge [u, v]:
 *      - If find(u) === find(v):
 *           → cycle detected → return false
 *      - Else:
 *           → union(u, v)
 *
 * 4. If all unions succeed → graph is connected and acyclic
 *    → return true
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Time:
 *   O(n α(n)) ≈ O(n)   (α = inverse Ackermann, very small)
 *
 * Space:
 *   O(n)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔵 CORE
 * ============================================================================
 *
 * Interviewers are testing:
 * - Do you know the formal definition of a tree?
 * - Can you detect cycles in undirected graphs?
 * - Do you understand Union-Find?
 *
 * This is a foundational graph sanity-check problem.
 * ============================================================================
 */

function validTree(n, edges) {
  // -------------------------------
  // Necessary condition
  // -------------------------------
  if (edges.length !== n - 1) return false;

  // -------------------------------
  // Union-Find setup
  // -------------------------------
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(0);

  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // path compression
    }
    return parent[x];
  }

  function union(x, y) {
    const px = find(x);
    const py = find(y);

    if (px === py) return false; // cycle

    // union by rank
    if (rank[px] < rank[py]) {
      parent[px] = py;
    } else if (rank[px] > rank[py]) {
      parent[py] = px;
    } else {
      parent[py] = px;
      rank[px]++;
    }
    return true;
  }

  // -------------------------------
  // Process edges
  // -------------------------------
  for (const [u, v] of edges) {
    if (!union(u, v)) {
      return false; // cycle detected
    }
  }

  return true;
}
