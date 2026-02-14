/**
 * ============================================================================
 * PROBLEM: Shortest Path with Alternating Colors (LeetCode #1129)
 * CATEGORY: 🟢 IMPORTANT (Graph BFS with Color-State)
 * ============================================================================
 *
 * You are given a directed graph with n nodes (0 to n - 1).
 *
 * There are two types of edges:
 * - redEdges
 * - blueEdges
 *
 * You want to find the shortest path from node 0 to every other node
 * such that the colors of edges used ALTERNATE at every step.
 *
 * Return an array answer where:
 *   answer[i] = length of the shortest alternating path from 0 to i,
 *               or -1 if no such path exists.
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   n = 3
 *   redEdges  = [[0,1],[1,2]]
 *   blueEdges = []
 *
 *   Output: [0, 1, -1]
 *
 *   Explanation:
 *   - 0 → 1 via red (valid)
 *   - 0 → 1 → 2 would require blue after red, but no blue edge exists
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= n <= 100
 * - 0 <= redEdges.length, blueEdges.length <= 400
 *
 * ============================================================================
 * INTUITION: Why Normal BFS Fails
 * ============================================================================
 *
 * This looks like a shortest path problem → BFS?
 *
 * The twist:
 * - The validity of a path depends on the COLOR of the previous edge
 *
 * Key Insight (VERY IMPORTANT):
 *
 *   Reaching the SAME node with DIFFERENT last-edge colors
 *   are DIFFERENT STATES.
 *
 * So:
 *   (node = 2, lastColor = red)  ≠  (node = 2, lastColor = blue)
 *
 * A simple visited[node] is WRONG.
 *
 * ============================================================================
 * STATE MODELING
 * ============================================================================
 *
 * State = (currentNode, lastEdgeColor)
 *
 * lastEdgeColor ∈ {RED, BLUE}
 *
 * At the start:
 * - We have not taken any edge yet
 * - So we can conceptually start with BOTH colors allowed
 *
 * ============================================================================
 * ALGORITHM (BFS with Color State)
 * ============================================================================
 *
 * 1. Build adjacency lists:
 *      redGraph[u]  = list of nodes reachable via red edges
 *      blueGraph[u] = list of nodes reachable via blue edges
 *
 * 2. distance[node][color]:
 *      shortest distance to reach node where the last edge used was `color`
 *
 * 3. Initialize:
 *      distance[0][RED]  = 0
 *      distance[0][BLUE] = 0
 *
 * 4. BFS queue stores:
 *      [node, lastColor]
 *
 * 5. From current state:
 *      - If lastColor == RED:
 *           → next edges must be BLUE
 *      - If lastColor == BLUE:
 *           → next edges must be RED
 *
 * 6. Take minimum distance over both colors for each node
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - V = number of nodes
 * - E = total edges
 *
 * Time:  O(V + E)
 * Space: O(V + E)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🟢 IMPORTANT
 * ============================================================================
 *
 * Interviewers are checking:
 * - Can you model state beyond just the node?
 * - Do you understand layered BFS?
 * - Can you reason about constraints affecting transitions?
 *
 * This problem is a CLEAN introduction to state-based graph traversal.
 * ============================================================================
 */

function shortestAlternatingPaths(n, redEdges, blueEdges) {
  // -------------------------------
  // Build adjacency lists by color
  // -------------------------------
  const redGraph = Array.from({ length: n }, () => []);
  const blueGraph = Array.from({ length: n }, () => []);

  for (const [u, v] of redEdges) redGraph[u].push(v);
  for (const [u, v] of blueEdges) blueGraph[u].push(v);

  // distance[node][0] = last edge was RED
  // distance[node][1] = last edge was BLUE
  const RED = 0;
  const BLUE = 1;

  const dist = Array.from({ length: n }, () => [Infinity, Infinity]);

  // -------------------------------
  // BFS initialization
  // -------------------------------
  const queue = [];
  dist[0][RED] = 0;
  dist[0][BLUE] = 0;
  queue.push([0, RED]);
  queue.push([0, BLUE]);

  // -------------------------------
  // BFS traversal
  // -------------------------------
  while (queue.length > 0) {
    const [node, lastColor] = queue.shift();
    const currDist = dist[node][lastColor];

    if (lastColor === RED) {
      // Next edge must be BLUE
      for (const nei of blueGraph[node]) {
        if (dist[nei][BLUE] === Infinity) {
          dist[nei][BLUE] = currDist + 1;
          queue.push([nei, BLUE]);
        }
      }
    } else {
      // Next edge must be RED
      for (const nei of redGraph[node]) {
        if (dist[nei][RED] === Infinity) {
          dist[nei][RED] = currDist + 1;
          queue.push([nei, RED]);
        }
      }
    }
  }

  // -------------------------------
  // Build result
  // -------------------------------
  const result = Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    const best = Math.min(dist[i][RED], dist[i][BLUE]);
    if (best !== Infinity) result[i] = best;
  }

  return result;
}
