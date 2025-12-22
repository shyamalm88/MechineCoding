/**
 * ============================================================================
 * PROBLEM: Number of Connected Components in an Undirected Graph (LeetCode #323)
 * ============================================================================
 *
 * You have a graph of n nodes. You are given an integer n and an array edges
 * where edges[i] = [ai, bi] indicates that there is an undirected edge
 * between nodes ai and bi in the graph.
 *
 * Return the number of connected components in the graph.
 *
 * Example 1:
 *
 *   0 --- 1     3
 *         |     |
 *         2     4
 *
 * Input: n = 5, edges = [[0,1],[1,2],[3,4]]
 * Output: 2
 * Explanation: Component 1: {0,1,2}, Component 2: {3,4}
 *
 * Example 2:
 *
 *   0 --- 1     3
 *         |     |
 *         2 --- 4
 *
 * Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
 * Output: 1
 * Explanation: All nodes are connected in one component.
 *
 * Example 3:
 *
 *   0     1     2     3     4
 *   (all isolated)
 *
 * Input: n = 5, edges = []
 * Output: 5
 * Explanation: Each node is its own component.
 *
 * Constraints:
 * - 1 <= n <= 2000
 * - 1 <= edges.length <= 5000
 * - edges[i].length == 2
 * - 0 <= ai <= bi < n
 * - ai != bi
 * - No duplicate edges
 *
 * ============================================================================
 * INTUITION: DFS to Count Connected Components
 * ============================================================================
 *
 * Core Idea:
 * - A connected component = a group of nodes where you can reach any node
 *   from any other node in the group
 * - If graph is disconnected, there are multiple components
 *
 * Algorithm:
 * 1. Build adjacency list from edge list
 * 2. Keep visited array to track which nodes we've seen
 * 3. For each unvisited node:
 *    a. Increment component count (new component found!)
 *    b. DFS to mark all nodes in this component as visited
 * 4. Return total component count
 *
 * Why this works:
 * - DFS from any node visits ALL nodes reachable from it
 * - After DFS, all nodes in that component are marked visited
 * - Next unvisited node must be in a DIFFERENT component
 *
 * Visual:
 *
 *   0 -- 1    3 -- 4
 *        |
 *        2
 *
 *   DFS from 0: visits 0 -> 1 -> 2 (marks all visited)
 *   Node 3 unvisited? New component! DFS from 3: visits 3 -> 4
 *   Total: 2 components
 *
 * Time Complexity: O(V + E) - build graph + visit each node and edge once
 * Space Complexity: O(V + E) - adjacency list + visited array + recursion stack
 * ============================================================================
 */

/**
 * @param {number} n - number of nodes (0 to n-1)
 * @param {number[][]} edges - list of undirected edges
 * @return {number} number of connected components
 */
const countComponents = (n, edges) => {
  // Step 1: Build adjacency list
  // graph[i] contains all nodes directly connected to i
  const graph = Array.from({ length: n }, () => []);

  for (let [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u); // undirected graph
  }

  // visited[i] = 1 means node i already belongs to some component
  const visited = new Array(n).fill(0);

  let components = 0;

  /**
   * DFS to mark all nodes in the same component
   * @param {number} node - current node to explore
   */
  const dfs = (node) => {
    visited[node] = 1;

    for (let neighbor of graph[node]) {
      if (!visited[neighbor]) {
        dfs(neighbor);
      }
    }
  };

  // Step 2: Try starting DFS from every node
  for (let i = 0; i < n; i++) {
    // If node i is not visited, it starts a new connected component
    if (visited[i] === 0) {
      components++; // Found one new component!
      dfs(i); // Mark all nodes in this component
    }
  }

  return components;
};

// ============================================================================
// ALTERNATIVE: BFS Approach
// ============================================================================
const countComponentsBFS = (n, edges) => {
  const graph = Array.from({ length: n }, () => []);

  for (let [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const visited = new Array(n).fill(0);
  let components = 0;

  for (let i = 0; i < n; i++) {
    if (visited[i] === 0) {
      components++;

      // BFS from node i
      const queue = [i];
      visited[i] = 1;

      while (queue.length > 0) {
        const node = queue.shift();

        for (let neighbor of graph[node]) {
          if (visited[neighbor] === 0) {
            visited[neighbor] = 1;
            queue.push(neighbor);
          }
        }
      }
    }
  }

  return components;
};

// ============================================================================
// ALTERNATIVE: Union-Find (Disjoint Set Union)
// ============================================================================
const countComponentsUnionFind = (n, edges) => {
  // Initially, each node is its own parent (n separate components)
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  // Find with path compression
  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  // Union by rank
  const union = (x, y) => {
    const px = find(x);
    const py = find(y);
    if (px === py) return false; // Already in same component

    if (rank[px] < rank[py]) {
      parent[px] = py;
    } else if (rank[px] > rank[py]) {
      parent[py] = px;
    } else {
      parent[py] = px;
      rank[px]++;
    }
    return true; // Successfully merged two components
  };

  // Start with n components
  let components = n;

  // Union connected nodes
  for (let [u, v] of edges) {
    if (union(u, v)) {
      components--; // Merged two components into one
    }
  }

  return components;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Two components
console.log(
  "Test 1:",
  countComponents(5, [
    [0, 1],
    [1, 2],
    [3, 4],
  ])
);
// Expected: 2 ({0,1,2} and {3,4})

// Test 2: One component (all connected)
console.log(
  "Test 2:",
  countComponents(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ])
);
// Expected: 1

// Test 3: All isolated (no edges)
console.log("Test 3:", countComponents(5, []));
// Expected: 5

// Test 4: Single node
console.log("Test 4:", countComponents(1, []));
// Expected: 1

// Test 5: Two connected nodes
console.log("Test 5:", countComponents(2, [[0, 1]]));
// Expected: 1

// Test 6: Triangle
console.log(
  "Test 6:",
  countComponents(3, [
    [0, 1],
    [1, 2],
    [0, 2],
  ])
);
// Expected: 1

// Test 7: Three separate components
console.log(
  "Test 7:",
  countComponents(6, [
    [0, 1],
    [2, 3],
    [4, 5],
  ])
);
// Expected: 3

// Test 8: Star graph (all connected to center)
console.log(
  "Test 8:",
  countComponents(5, [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ])
);
// Expected: 1

// Test 9: BFS approach
console.log("\n--- BFS Approach ---");
console.log(
  "Test 9:",
  countComponentsBFS(5, [
    [0, 1],
    [1, 2],
    [3, 4],
  ])
);
// Expected: 2

// Test 10: Union-Find approach
console.log("\n--- Union-Find Approach ---");
console.log(
  "Test 10:",
  countComponentsUnionFind(5, [
    [0, 1],
    [1, 2],
    [3, 4],
  ])
);
// Expected: 2
