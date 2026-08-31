/**
 * ============================================================================
 * PROBLEM: Minimum Height Trees (LeetCode #310)
 * ============================================================================
 * A tree is an undirected graph with n nodes labelled 0..n-1 and n-1 edges.
 * Rooting the tree at different nodes gives trees of different heights. Return
 * a list of all root labels that give a MINIMUM height tree, in any order.
 *
 * Example 1:
 * Input: n = 4, edges = [[1,0],[1,2],[1,3]] → Output: [1]
 *
 * Example 2:
 * Input: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]] → Output: [3,4]
 *
 * Constraints:
 * - 1 <= n <= 2 * 10^4
 * - edges.length == n - 1
 * - The given input is guaranteed to be a tree
 */

// ============================================================================
// APPROACH: BFS Leaf-Peeling (Topological Sort on an Undirected Tree)
// ============================================================================
/**
 * STORY / INTUITION:
 * The brute force — root the tree at each node and BFS for its height — is
 * O(N^2) and times out. The insight that collapses it:
 *
 * The best roots sit at the CENTRE of the tree's longest path, and a tree has
 * AT MOST TWO such centroids (two when the longest path has even length, one
 * when odd). So the answer is never more than two nodes.
 *
 * Find the centre by peeling: repeatedly strip every current leaf, layer by
 * layer, like peeling an onion inward. Whatever survives when 2 or fewer nodes
 * remain IS the centre. A leaf can never be a better root than its neighbour —
 * rooting one step inward shortens the far side — so no leaf is ever the answer,
 * and stripping them all is safe.
 *
 * This is topological sort adapted to an undirected graph: instead of in-degree
 * 0, the frontier is degree 1, and decrementing a neighbour's degree to 1 makes
 * it the next layer's leaf.
 *
 * WHY STOP AT 2, NOT 1: peeling removes one node from EACH end of the longest
 * path per round. If that path has an even number of nodes, two survive together
 * and both are valid answers; peeling further would wrongly discard one.
 *
 * EDGE CASE: n === 1 has no edges and no leaves by the degree-1 test, so the
 * loop would never run — it is returned directly.
 *
 * DRY RUN: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]
 *   degrees: 0:1  1:1  2:1  3:4  4:2  5:1
 *   leaves = [0,1,2,5], remaining 6 > 2 → strip them, remaining = 2
 *     0,1,2 each drop node 3: degree 4 → 3 → 2 → 1, so 3 joins the next layer
 *     5 drops node 4: degree 2 → 1, so 4 joins too
 *   leaves = [3,4], remaining 2 → loop ends
 *   answer [3,4]
 *
 * Time:  O(N) — every node and edge handled once
 * Space: O(N) for the adjacency list and degree array
 */
const findMinHeightTrees = (n, edges) => {
  // A single node is its own centre; it has no degree-1 leaf to peel.
  if (n === 1) return [0];

  const adjacency = Array.from({ length: n }, () => []);
  const degree = new Array(n).fill(0);

  for (const [a, b] of edges) {
    adjacency[a].push(b);
    adjacency[b].push(a);
    degree[a]++;
    degree[b]++;
  }

  // In an undirected tree the frontier is degree 1, not in-degree 0.
  let leaves = [];
  for (let node = 0; node < n; node++) {
    if (degree[node] === 1) leaves.push(node);
  }

  let remaining = n;

  // Stop at 2: an even-length longest path leaves two valid centroids.
  while (remaining > 2) {
    remaining -= leaves.length;
    const nextLayer = [];

    for (const leaf of leaves) {
      for (const neighbour of adjacency[leaf]) {
        // Becoming degree 1 means this neighbour is now itself a leaf.
        if (--degree[neighbour] === 1) nextLayer.push(neighbour);
      }
    }

    leaves = nextLayer;
  }

  return leaves;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Minimum Height Trees Tests ===\n");

console.log("Test 1:", JSON.stringify(findMinHeightTrees(4, [[1, 0], [1, 2], [1, 3]])));
// Expected: [1]

console.log("Test 2:", JSON.stringify(findMinHeightTrees(6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]])));
// Expected: [3,4]

console.log("Test 3:", JSON.stringify(findMinHeightTrees(1, [])));
// Expected: [0]

console.log("Test 4:", JSON.stringify(findMinHeightTrees(2, [[0, 1]])));
// Expected: [0,1]

console.log("Test 5:", JSON.stringify(findMinHeightTrees(7, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]])));
// Expected: [3] (a straight line of 7 → the middle node)

module.exports = { findMinHeightTrees };
