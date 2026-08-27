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
