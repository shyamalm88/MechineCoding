/**
 * ============================================================================
 * PROBLEM: Reconstruct Itinerary (LeetCode #332)
 * CATEGORY: 🔴 VVIMP (Directed Graph + Lexicographic Eulerian Path)
 * ============================================================================
 *
 * You are given a list of airline tickets where:
 *
 *   tickets[i] = [from, to]
 *
 * Each ticket represents a one-way flight.
 *
 * You must:
 * - Use ALL tickets exactly once
 * - Start from "JFK"
 * - Return the itinerary with the SMALLEST lexicographical order
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   tickets = [
 *     ["MUC","LHR"],
 *     ["JFK","MUC"],
 *     ["SFO","SJC"],
 *     ["LHR","SFO"]
 *   ]
 *
 *   Output:
 *   ["JFK","MUC","LHR","SFO","SJC"]
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - tickets.length >= 1
 * - tickets form at least one valid itinerary
 *
 * ============================================================================
 * INTUITION: Why This Is NOT a BFS / Shortest Path Problem
 * ============================================================================
 *
 * This problem is NOT about distance.
 *
 * Key Insight (CRITICAL):
 *
 *   You must use EVERY EDGE exactly once.
 *
 * That immediately tells us:
 *   ➤ This is an EULERIAN PATH problem
 *
 * Additional twist:
 * - Among multiple valid Eulerian paths,
 *   return the LEXICOGRAPHICALLY smallest one.
 *
 * ============================================================================
 * GRAPH THEORY BACKGROUND (IMPORTANT)
 * ============================================================================
 *
 * An Eulerian path:
 * - Visits every edge exactly once
 *
 * For a directed graph:
 * - At most one node has (outDegree - inDegree) = 1 → start
 * - At most one node has (inDegree - outDegree) = 1 → end
 *
 * Problem guarantees a valid path exists,
 * and we MUST start from "JFK".
 *
 * ============================================================================
 * WHY GREEDY BFS / DFS FAILS
 * ============================================================================
 *
 * Greedy approach:
 *   "Always take the smallest destination first"
 *
 * ❌ WRONG.
 *
 * Why?
 * - Choosing a lexicographically smallest edge early
 *   may BLOCK the ability to use all edges later.
 *
 * We need:
 * - Post-order traversal
 * - Only commit to a node AFTER exhausting its outgoing edges
 *
 * ============================================================================
 * CORRECT ALGORITHM: HIERHOLZER’S ALGORITHM
 * ============================================================================
 *
 * Hierholzer’s algorithm:
 * - Finds an Eulerian path
 * - Uses DFS
 * - Adds nodes to result AFTER exploring all outgoing edges
 *
 * To handle lexicographical order:
 * - Store outgoing edges in MIN-HEAPS
 *
 * ============================================================================
 * ALGORITHM (STEP-BY-STEP)
 * ============================================================================
 *
 * 1. Build adjacency list:
 *      graph[from] = min-heap of destinations
 *
 * 2. DFS from "JFK":
 *      while graph[node] is not empty:
 *        next = smallest destination
 *        DFS(next)
 *
 * 3. AFTER exploring all outgoing edges:
 *      add node to itinerary
 *
 * 4. Reverse itinerary at the end
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - E = number of tickets
 *
 * Time:
 *   O(E log E)   (heap operations)
 *
 * Space:
 *   O(E)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔴 VVIMP
 * ============================================================================
 *
 * Interviewers are testing:
 * - Do you recognize Eulerian path?
 * - Do you know WHY greedy fails?
 * - Can you reason about post-order DFS?
 *
 * Many strong BFS/Dijkstra candidates FAIL here.
 * ============================================================================
 */

function findItinerary(tickets) {
  // -------------------------------
  // Build graph with min-heaps
  // -------------------------------
  const graph = new Map();

  for (const [from, to] of tickets) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push(to);
  }

  // Sort destinations lexicographically (reverse for efficient pop)
  for (const dests of graph.values()) {
    dests.sort().reverse();
  }

  const itinerary = [];

  // -------------------------------
  // Hierholzer DFS
  // -------------------------------
  function dfs(airport) {
    const dests = graph.get(airport) || [];

    while (dests.length > 0) {
      const next = dests.pop(); // smallest lex
      dfs(next);
    }

    // Post-order insertion
    itinerary.push(airport);
  }

  dfs("JFK");

  // Reverse because we built itinerary backwards
  return itinerary.reverse();
}
