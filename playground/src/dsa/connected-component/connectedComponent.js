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
