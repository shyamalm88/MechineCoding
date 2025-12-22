/**
 * ============================================================================
 * PROBLEM: Graph Valid Tree (LeetCode #261)
 * ============================================================================
 *
 * You have a graph of n nodes labeled from 0 to n - 1. You are given an integer
 * n and a list of edges where edges[i] = [ai, bi] indicates that there is an
 * undirected edge between nodes ai and bi in the graph.
 *
 * Return true if the edges of the given graph make up a valid tree, and
 * false otherwise.
 *
 * A valid tree must satisfy:
 * 1. NO CYCLES - A tree has no cycles
 * 2. FULLY CONNECTED - All nodes must be reachable from any other node
 *
 * Example 1:
 *
 *       0
 *      /|\
 *     1 2 3
 *     |
 *     4
 *
 * Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
 * Output: true
 * Explanation: No cycles, all nodes connected.
 *
 * Example 2:
 *
 *     0 --- 1
 *     |     |
 *     3 --- 2
 *
 *     4 (isolated)
 *
 * Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
 * Output: false
 * Explanation: Contains a cycle (0-1-2-3-0) OR node 4 might be disconnected.
 *
 * Example 3:
 *
 *     0     1     (disconnected)
 *
 * Input: n = 2, edges = []
 * Output: false
 * Explanation: Not fully connected.
 *
 * Constraints:
 * - 1 <= n <= 2000
 * - 0 <= edges.length <= 5000
 * - edges[i].length == 2
 * - 0 <= ai, bi < n
 * - ai != bi
 * - No duplicate edges
 *
 * ============================================================================
 * INTUITION: DFS Cycle Detection + Connectivity Check
 * ============================================================================
 *
 * Tree Properties:
 * - A tree with n nodes has exactly n-1 edges
 * - A tree has no cycles
 * - A tree is fully connected (one component)
 *
 * Quick Check (Optional):
 * - If edges.length !== n - 1, it CANNOT be a valid tree
 * - Too few edges = disconnected
 * - Too many edges = must have cycle
 *
 * Algorithm:
 * 1. Build adjacency list (undirected graph)
 * 2. DFS from node 0 to detect cycles
 * 3. Check if all nodes were visited (connectivity)
 *
 * Cycle Detection in UNDIRECTED Graph:
 * - Key difference from directed graph!
 * - In undirected: edge A-B means we can go A->B and B->A
 * - When we go A->B, we should NOT count B->A as a cycle
 * - Solution: Pass "parent" node to DFS, ignore edge to parent
 *
 * Visual:
 *
 *   0 -- 1 -- 2
 *
 *   DFS from 0:
 *   - Visit 0, go to neighbor 1 (parent = 0)
 *   - Visit 1, neighbors are [0, 2]
 *   - Neighbor 0 is parent, SKIP (not a cycle!)
 *   - Go to 2 (parent = 1)
 *   - Visit 2, neighbor is 1
 *   - Neighbor 1 is parent, SKIP
 *   - Done, no cycle found
 *
 * Time Complexity: O(V + E) - visit each node and edge once
 * Space Complexity: O(V + E) - adjacency list + recursion stack
 * ============================================================================
 */

/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
const validTree = (n, edges) => {
  // Quick check: A tree with n nodes must have exactly n-1 edges
  if (edges.length !== n - 1) return false;

  // Step 1: Build adjacency list for undirected graph
  const graph = Array.from({ length: n }, () => []);

  for (let [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a); // undirected edge
  }

  // visited[i] = 1 means node i has been visited
  const visited = new Array(n).fill(0);

  /**
   * DFS to detect cycles in undirected graph
   * @param {number} node - current node
   * @param {number} parent - node we came from (to ignore reverse edge)
   * @returns {boolean} true if cycle found
   */
  const hasCycle = (node, parent) => {
    // Mark current node as visited
    visited[node] = 1;

    // Explore all neighbors
    for (let neighbor of graph[node]) {
      // If neighbor is the parent, ignore (not a cycle in undirected graph)
      if (neighbor === parent) continue;

      // If neighbor is visited and is NOT parent -> CYCLE!
      if (visited[neighbor] === 1) return true;

      // Recursively check neighbor
      if (hasCycle(neighbor, node)) return true;
    }

    return false;
  };

  // Step 2: Check for cycle starting from node 0
  if (hasCycle(0, -1)) return false;

  // Step 3: Check connectivity - all nodes should be visited
  for (let i = 0; i < n; i++) {
    if (visited[i] === 0) return false;
  }

  return true;
};

// ============================================================================
// ALTERNATIVE: Union-Find Approach
// ============================================================================
const validTreeUnionFind = (n, edges) => {
  // Quick check
  if (edges.length !== n - 1) return false;

  // Union-Find with path compression
  const parent = Array.from({ length: n }, (_, i) => i);

  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  const union = (x, y) => {
    const px = find(x);
    const py = find(y);
    if (px === py) return false; // Already connected = cycle!
    parent[px] = py;
    return true;
  };

  // Try to union all edges
  for (let [a, b] of edges) {
    if (!union(a, b)) {
      return false; // Adding this edge would create a cycle
    }
  }

  // If we have n-1 edges and no cycles, graph is connected
  return true;
};

// ============================================================================
// ALTERNATIVE: BFS Approach
// ============================================================================
const validTreeBFS = (n, edges) => {
  if (edges.length !== n - 1) return false;

  const graph = Array.from({ length: n }, () => []);
  for (let [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a);
  }

  const visited = new Set();
  const queue = [[0, -1]]; // [node, parent]
  visited.add(0);

  while (queue.length > 0) {
    const [node, parent] = queue.shift();

    for (let neighbor of graph[node]) {
      if (neighbor === parent) continue;
      if (visited.has(neighbor)) return false; // Cycle detected
      visited.add(neighbor);
      queue.push([neighbor, node]);
    }
  }

  return visited.size === n;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Valid tree
console.log(
  "Test 1:",
  validTree(5, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
  ])
);
// Expected: true

// Test 2: Has cycle
console.log(
  "Test 2:",
  validTree(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 3],
    [1, 4],
  ])
);
// Expected: false (cycle 1-2-3-1)

// Test 3: Disconnected
console.log("Test 3:", validTree(4, [[0, 1], [2, 3]]));
// Expected: false (two components)

// Test 4: Single node
console.log("Test 4:", validTree(1, []));
// Expected: true

// Test 5: Two nodes connected
console.log("Test 5:", validTree(2, [[0, 1]]));
// Expected: true

// Test 6: Two nodes not connected
console.log("Test 6:", validTree(2, []));
// Expected: false

// Test 7: Linear tree
console.log(
  "Test 7:",
  validTree(4, [
    [0, 1],
    [1, 2],
    [2, 3],
  ])
);
// Expected: true

// Test 8: Too many edges (must have cycle)
console.log(
  "Test 8:",
  validTree(3, [
    [0, 1],
    [1, 2],
    [0, 2],
  ])
);
// Expected: false (3 edges for 3 nodes = cycle)

// Test 9: Union-Find approach
console.log("\n--- Union-Find Approach ---");
console.log(
  "Test 9:",
  validTreeUnionFind(5, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
  ])
);
// Expected: true

// Test 10: BFS approach
console.log("\n--- BFS Approach ---");
console.log(
  "Test 10:",
  validTreeBFS(5, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
  ])
);
// Expected: true

console.log(
  "Test 11:",
  validTreeBFS(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 3],
    [1, 4],
  ])
);
// Expected: false (cycle)
