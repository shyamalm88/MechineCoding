/**
 * ============================================================================
 * PROBLEM: Is Graph Bipartite? (LeetCode #785)
 * ============================================================================
 *
 * There is an undirected graph with n nodes, where each node is numbered
 * between 0 and n - 1. You are given a 2D array graph, where graph[u] is
 * an array of nodes that node u is adjacent to.
 *
 * A graph is bipartite if the nodes can be partitioned into two independent
 * sets A and B such that every edge in the graph connects a node in set A
 * and a node in set B.
 *
 * Return true if and only if the graph is bipartite.
 *
 * Example 1:
 *
 *     0 ---- 1
 *     |      |
 *     |      |
 *     3 ---- 2
 *
 * Input: graph = [[1,3],[0,2],[1,3],[0,2]]
 * Output: true
 * Explanation: Can split into A = {0, 2} and B = {1, 3}
 *              Every edge connects A to B.
 *
 * Example 2:
 *
 *     0 ---- 1
 *     | \    |
 *     |  \   |
 *     3 ---- 2
 *
 * Input: graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
 * Output: false
 * Explanation: Cannot partition. Node 0 connects to 1, 2, 3.
 *              If 0 is in A, then 1, 2, 3 must be in B.
 *              But 1-2 edge means both 1 and 2 in B... invalid!
 *
 * Constraints:
 * - graph.length == n
 * - 1 <= n <= 100
 * - 0 <= graph[u].length < n
 * - 0 <= graph[u][i] <= n - 1
 * - graph[u] does not contain u (no self-loops)
 * - graph[u][i] != graph[u][j] for all i != j (no duplicate edges)
 * - If graph[u] contains v, then graph[v] contains u (undirected)
 *
 * ============================================================================
 * INTUITION: Two-Coloring with DFS
 * ============================================================================
 *
 * Bipartite = Two-Colorable!
 *
 * Key Insight:
 * - A graph is bipartite if and only if we can color all nodes with 2 colors
 *   such that no two adjacent nodes have the same color
 * - This is equivalent to: graph has NO odd-length cycles
 *
 * Algorithm (2-Coloring with DFS):
 * 1. Use colors: -1 (unvisited), 0 (group A), 1 (group B)
 * 2. Start DFS from any unvisited node, assign color 0
 * 3. For each neighbor:
 *    a. If same color as current node -> NOT bipartite (conflict!)
 *    b. If uncolored, assign opposite color and continue DFS
 *    c. If different color, OK (already correctly colored)
 * 4. Graph may be disconnected, so check all components
 *
 * Visual (2-Coloring):
 *
 *     0(A) ---- 1(B)
 *       |        |
 *       |        |
 *     3(B) ---- 2(A)
 *
 *   Color 0 as A (0)
 *   Neighbors 1, 3 must be B (1)
 *   Neighbor of 1 is 2, must be A (0)
 *   Check: 2's neighbor 3 is B (1) - OK!
 *   Bipartite!
 *
 * Why check if neighbor has SAME color?
 * - If we're at node X with color C, all neighbors should have color (1-C)
 * - If a neighbor already has color C -> edge within same group -> NOT bipartite
 *
 * Time Complexity: O(V + E) - visit each node and edge once
 * Space Complexity: O(V) - color array + recursion stack
 * ============================================================================
 */

/**
 * @param {number[][]} graph - adjacency list representation
 * @return {boolean}
 */
const isBipartite = (graph) => {
  const n = graph.length;

  // color[i] = -1 (unvisited), 0 (group A), 1 (group B)
  const color = new Array(n).fill(-1);

  /**
   * DFS to color the graph
   * @param {number} node - current node
   * @param {number} c - color to assign (0 or 1)
   * @returns {boolean} true if valid 2-coloring possible from this node
   */
  const dfs = (node, c) => {
    // Assign color to current node
    color[node] = c;

    // Check all neighbors
    for (let neighbor of graph[node]) {
      // If neighbor has same color -> NOT bipartite!
      if (color[neighbor] === c) return false;

      // If neighbor unvisited, color it with opposite color
      if (color[neighbor] === -1) {
        // 1-0=1, 1-1=0 (flips between 0 and 1)
        if (!dfs(neighbor, 1 - c)) return false;
      }
      // If neighbor already has different color, that's OK (skip)
    }

    return true;
  };

  // Graph might be disconnected, so check all components
  for (let i = 0; i < n; i++) {
    if (color[i] === -1) {
      if (!dfs(i, 0)) return false;
    }
  }

  return true;
};

// ============================================================================
// ALTERNATIVE: BFS Approach (Level-order coloring)
// ============================================================================
const isBipartiteBFS = (graph) => {
  const n = graph.length;
  const color = new Array(n).fill(-1);

  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue; // Already colored

    // BFS from this node
    const queue = [start];
    color[start] = 0;

    while (queue.length > 0) {
      const node = queue.shift();

      for (let neighbor of graph[node]) {
        if (color[neighbor] === -1) {
          // Unvisited: assign opposite color
          color[neighbor] = 1 - color[node];
          queue.push(neighbor);
        } else if (color[neighbor] === color[node]) {
          // Same color as current node -> conflict!
          return false;
        }
      }
    }
  }

  return true;
};

// ============================================================================
// ALTERNATIVE: Union-Find (Check if odd cycle exists)
// ============================================================================
const isBipartiteUnionFind = (graph) => {
  const n = graph.length;
  const parent = Array.from({ length: n }, (_, i) => i);

  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  const union = (x, y) => {
    parent[find(x)] = find(y);
  };

  for (let node = 0; node < n; node++) {
    for (let neighbor of graph[node]) {
      // If node and neighbor are in same group -> NOT bipartite
      if (find(node) === find(neighbor)) {
        return false;
      }
      // Union all neighbors together (they should be in same group)
      union(graph[node][0], neighbor);
    }
  }

  return true;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Square graph (bipartite)
console.log(
  "Test 1:",
  isBipartite([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ])
);
// Expected: true (A={0,2}, B={1,3})

// Test 2: Triangle in graph (not bipartite)
console.log(
  "Test 2:",
  isBipartite([
    [1, 2, 3],
    [0, 2],
    [0, 1, 3],
    [0, 2],
  ])
);
// Expected: false (triangle 0-1-2)

// Test 3: Simple edge (bipartite)
console.log("Test 3:", isBipartite([[1], [0]]));
// Expected: true

// Test 4: Single node (bipartite)
console.log("Test 4:", isBipartite([[]]));
// Expected: true

// Test 5: Complete graph K3 - triangle (not bipartite)
console.log(
  "Test 5:",
  isBipartite([
    [1, 2],
    [0, 2],
    [0, 1],
  ])
);
// Expected: false

// Test 6: Linear graph (bipartite)
console.log(
  "Test 6:",
  isBipartite([[1], [0, 2], [1, 3], [2]])
);
// Expected: true (0-1-2-3 line)

// Test 7: Disconnected bipartite components
console.log(
  "Test 7:",
  isBipartite([[1], [0], [3], [2]])
);
// Expected: true (two separate edges)

// Test 8: Star graph (bipartite)
console.log(
  "Test 8:",
  isBipartite([
    [1, 2, 3],
    [0],
    [0],
    [0],
  ])
);
// Expected: true (center vs leaves)

// Test 9: Pentagon (odd cycle - not bipartite)
console.log(
  "Test 9:",
  isBipartite([
    [1, 4],
    [0, 2],
    [1, 3],
    [2, 4],
    [3, 0],
  ])
);
// Expected: false (5-cycle is odd)

// Test 10: Hexagon (even cycle - bipartite)
console.log(
  "Test 10:",
  isBipartite([
    [1, 5],
    [0, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 0],
  ])
);
// Expected: true (6-cycle is even)

// Test 11: BFS approach
console.log("\n--- BFS Approach ---");
console.log(
  "Test 11:",
  isBipartiteBFS([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ])
);
// Expected: true

console.log(
  "Test 12:",
  isBipartiteBFS([
    [1, 2, 3],
    [0, 2],
    [0, 1, 3],
    [0, 2],
  ])
);
// Expected: false
