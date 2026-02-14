/**
 * ============================================================================
 * PROBLEM: Path With Maximum Probability (LeetCode #1514)
 * CATEGORY: 🔵 CORE (Dijkstra with Modified Cost Function)
 * ============================================================================
 *
 * You are given an undirected graph with n nodes (labeled 0 to n - 1).
 *
 * You are given:
 * - edges[i] = [a, b]  → an undirected edge between a and b
 * - succProb[i]        → probability of successfully traversing that edge
 *
 * You are also given:
 * - start node
 * - end node
 *
 * Return the maximum probability of reaching end from start.
 * If there is no path, return 0.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   n = 3
 *   edges = [[0,1],[1,2],[0,2]]
 *   succProb = [0.5, 0.5, 0.2]
 *   start = 0, end = 2
 *
 *   Paths:
 *     0 → 2        → prob = 0.2
 *     0 → 1 → 2    → prob = 0.5 × 0.5 = 0.25  ✅
 *
 *   Output: 0.25
 *
 * Example 2:
 *
 *   n = 3
 *   edges = [[0,1]]
 *   succProb = [0.5]
 *   start = 0, end = 2
 *
 *   Output: 0 (no path)
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= n <= 10^4
 * - 0 <= edges.length <= 2 * 10^4
 * - 0 <= succProb[i] <= 1
 * - Undirected graph
 *
 * ============================================================================
 * INTUITION: Dijkstra Is NOT About "Sum" — It's About Greedy Best-First Expansion
 * ============================================================================
 *
 * This problem looks different, but it is still Dijkstra.
 *
 * The only difference:
 * - Path "cost" is NOT the sum of weights
 * - Path "cost" is the PRODUCT of probabilities
 *
 * What we want:
 * - The path with the MAXIMUM probability
 *
 * Key Insight (VERY IMPORTANT):
 * - Probabilities are in range [0, 1]
 * - Multiplying by another probability NEVER increases the value
 * - So once we reach a node with the highest possible probability,
 *   no future path can improve it
 *
 * That preserves Dijkstra’s core invariant:
 *
 *   ➤ When we pop a node from the heap,
 *     its best probability is FINAL.
 *
 * ============================================================================
 * REFRAMING THE PROBLEM
 * ============================================================================
 *
 * Instead of thinking:
 *   "Shortest path"
 *
 * Think:
 *   "Most reliable path"
 *
 * The algorithm:
 * - Always expand the node that currently has the HIGHEST probability
 * - Try to improve neighbors via this node
 *
 * This is Dijkstra with:
 * - Max-heap instead of min-heap
 * - Multiplication instead of addition
 *
 * ============================================================================
 * ALGORITHM (Modified Dijkstra)
 * ============================================================================
 *
 * 1. Build adjacency list:
 *      graph[u] = [v, probability]
 *
 * 2. bestProb[i] = maximum probability to reach node i so far
 *
 * 3. Initialize:
 *      bestProb[start] = 1
 *      all others = 0
 *
 * 4. Use a MAX-HEAP priority queue storing:
 *      [probability, node]
 *
 * 5. While heap is not empty:
 *      a. Pop node with highest probability
 *      b. If this is end → return probability (EARLY EXIT)
 *      c. If stale entry → skip
 *      d. Relax neighbors:
 *           newProb = currProb × edgeProb
 *           if newProb > bestProb[neighbor]:
 *              update + push
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Time:  O((V + E) log V)
 * Space: O(V + E)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔵 CORE
 * ============================================================================
 *
 * This problem proves whether you REALLY understand Dijkstra.
 *
 * Interviewers are checking:
 * - Do you think Dijkstra is only for sums? ❌
 * - Do you understand greedy invariants? ✅
 * - Can you change heap direction correctly?
 *
 * If you can do this cleanly, your foundation is strong.
 * ============================================================================
 */

function maxProbability(n, edges, succProb, start, end) {
  // -------------------------------
  // Build adjacency list
  // -------------------------------
  const graph = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    const p = succProb[i];
    graph[u].push([v, p]);
    graph[v].push([u, p]);
  }

  // -------------------------------
  // Best probability array
  // -------------------------------
  const bestProb = Array(n).fill(0);
  bestProb[start] = 1;

  // -------------------------------
  // Max-Heap: higher probability first
  // -------------------------------
  const pq = new PriorityQueue((a, b) => a[0] > b[0]);
  pq.push([1, start]);

  // -------------------------------
  // Dijkstra
  // -------------------------------
  while (pq.size() > 0) {
    const [currProb, node] = pq.pop();

    // Early exit: best possible path to end found
    if (node === end) return currProb;

    // Skip stale entry
    if (currProb < bestProb[node]) continue;

    for (const [nei, edgeProb] of graph[node]) {
      const newProb = currProb * edgeProb;

      if (newProb > bestProb[nei]) {
        bestProb[nei] = newProb;
        pq.push([newProb, nei]);
      }
    }
  }

  return 0;
}
