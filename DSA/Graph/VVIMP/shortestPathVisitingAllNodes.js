/**
 * ============================================================================
 * PROBLEM: Shortest Path Visiting All Nodes (LeetCode #847)
 * CATEGORY: 🔴 VVIMP (Bitmask BFS on State Space)
 * ============================================================================
 *
 * You are given an undirected, connected graph with n nodes labeled 0 to n-1.
 *
 * You can start at ANY node.
 *
 * Your goal:
 * - Visit ALL nodes
 * - Minimize the number of edges traversed
 *
 * You may revisit nodes and edges.
 *
 * Return the length of the shortest path that visits all nodes.
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   graph = [[1,2,3],[0],[0],[0]]
 *
 *   One optimal path:
 *     1 → 0 → 2 → 0 → 3
 *
 *   Output: 4
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= n <= 12
 * - graph[i] contains neighbors of i
 *
 * ============================================================================
 * INTUITION: This Is NOT a Normal Graph Problem
 * ============================================================================
 *
 * We are NOT trying to reach a target node.
 *
 * We are trying to reach a STATE:
 *   ➤ "All nodes have been visited"
 *
 * Key Insight (CRITICAL):
 *
 *   Reaching the SAME node with DIFFERENT sets of visited nodes
 *   are DIFFERENT STATES.
 *
 * So:
 *   (node = 3, visited = {0,1,2}) ≠ (node = 3, visited = {0,2})
 *
 * This is NOT solvable with visited[node].
 *
 * ============================================================================
 * STATE MODELING (THE HEART OF THE PROBLEM)
 * ============================================================================
 *
 * State = (currentNode, visitedMask)
 *
 * Where:
 * - visitedMask is a BITMASK of size n
 * - bit i is ON if node i has been visited
 *
 * Example (n = 4):
 *   visitedMask = 1011 (binary)
 *   → nodes {0,1,3} visited
 *
 * Goal State:
 *   visitedMask == (1 << n) - 1
 *
 * ============================================================================
 * WHY BFS WORKS (VERY IMPORTANT)
 * ============================================================================
 *
 * Each move:
 * - Traverses exactly ONE edge
 * - Has equal cost
 *
 * So:
 * - This is shortest path in an UNWEIGHTED state graph
 * - BFS guarantees optimality
 *
 * Even though the state space is large, BFS is correct.
 *
 * ============================================================================
 * MULTI-SOURCE BFS (KEY OPTIMIZATION)
 * ============================================================================
 *
 * You can START at ANY node.
 *
 * Instead of running BFS n times:
 * - Start BFS simultaneously from ALL nodes
 *
 * Initial states:
 *   (0, mask=0001)
 *   (1, mask=0010)
 *   ...
 *   (n-1, mask=1000)
 *
 * This dramatically simplifies the logic.
 *
 * ============================================================================
 * ALGORITHM (BITMASK BFS)
 * ============================================================================
 *
 * 1. Let fullMask = (1 << n) - 1
 *
 * 2. BFS queue holds:
 *      [node, visitedMask]
 *
 * 3. visited[node][mask] = true
 *
 * 4. Initialize queue with all nodes:
 *      mask = 1 << node
 *
 * 5. BFS:
 *      For each state:
 *        - If mask == fullMask → return steps
 *        - For each neighbor:
 *             nextMask = mask | (1 << neighbor)
 *             if not visited:
 *                 enqueue
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Number of states:
 *   n × 2^n
 *
 * Time:
 *   O(n × 2^n)
 *
 * Space:
 *   O(n × 2^n)
 *
 * With n ≤ 12, this is feasible.
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔴 VVIMP
 * ============================================================================
 *
 * Interviewers are testing:
 * - Can you reason about exponential state spaces?
 * - Do you know when bitmasking is appropriate?
 * - Can you explain WHY BFS is still valid?
 *
 * This problem is a STRONG Staff-level signal.
 * ============================================================================
 */

function shortestPathLength(graph) {
  const n = graph.length;
  const fullMask = (1 << n) - 1;

  // visited[node][mask]
  const visited = Array.from({ length: n }, () => Array(1 << n).fill(false));

  const queue = [];

  // -------------------------------
  // Multi-source BFS initialization
  // -------------------------------
  for (let i = 0; i < n; i++) {
    const mask = 1 << i;
    queue.push([i, mask, 0]); // node, mask, steps
    visited[i][mask] = true;
  }

  // -------------------------------
  // BFS
  // -------------------------------
  while (queue.length > 0) {
    const [node, mask, steps] = queue.shift();

    if (mask === fullMask) return steps;

    for (const nei of graph[node]) {
      const nextMask = mask | (1 << nei);

      if (!visited[nei][nextMask]) {
        visited[nei][nextMask] = true;
        queue.push([nei, nextMask, steps + 1]);
      }
    }
  }

  return -1;
}
