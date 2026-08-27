// Definition for a Node
function Node(val = 0, neighbors = []) {
  this.val = val;
  this.neighbors = neighbors;
}

/**
 * @param {Node} node
 * @return {Node}
 */
const cloneGraph = (node) => {
  if (!node) return null;

  // Map: original node -> cloned node
  const map = new Map();

  const dfs = (node) => {
    // If already cloned, return the clone (handles cycles!)
    if (map.has(node)) {
      return map.get(node);
    }

    // Create a clone of current node (without neighbors yet)
    const clone = new Node(node.val);

    // IMPORTANT: Add to map BEFORE recursing to handle cycles
    map.set(node, clone);

    // Recursively clone all neighbors and add to clone's neighbors
    for (let neighbor of node.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }

    return clone;
  };

  return dfs(node);
};

// ============================================================================
// HELPER: Build graph from adjacency list
// ============================================================================
const buildGraph = (adjList) => {
  if (!adjList || adjList.length === 0) return null;

  const nodes = adjList.map((_, i) => new Node(i + 1));

  for (let i = 0; i < adjList.length; i++) {
    nodes[i].neighbors = adjList[i].map((idx) => nodes[idx - 1]);
  }

  return nodes[0];
};

// Helper: Convert graph to adjacency list for display
const graphToAdjList = (node, n) => {
  if (!node) return [];

  const result = Array.from({ length: n }, () => []);
  const visited = new Set();
  const queue = [node];

  while (queue.length > 0) {
    const curr = queue.shift();
    if (visited.has(curr.val)) continue;
    visited.add(curr.val);

    result[curr.val - 1] = curr.neighbors.map((n) => n.val);
    for (let neighbor of curr.neighbors) {
      if (!visited.has(neighbor.val)) {
        queue.push(neighbor);
      }
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Square graph (1-2-3-4)
const adjList1 = [
  [2, 4],
  [1, 3],
  [2, 4],
  [1, 3],
];
const graph1 = buildGraph(adjList1);
const clone1 = cloneGraph(graph1);
console.log("Test 1 - Square graph:");
console.log("Original:", graphToAdjList(graph1, 4));
console.log("Clone:", graphToAdjList(clone1, 4));
console.log("Different objects:", graph1 !== clone1);
// Expected: [[2,4],[1,3],[2,4],[1,3]]

// Test 2: Single node with no neighbors
const adjList2 = [[]];
const graph2 = buildGraph(adjList2);
const clone2 = cloneGraph(graph2);
console.log("\nTest 2 - Single node:");
console.log("Clone val:", clone2?.val);
console.log("Clone neighbors:", clone2?.neighbors.length);
// Expected: Node with val=1, no neighbors

// Test 3: Empty graph
const clone3 = cloneGraph(null);
console.log("\nTest 3 - Empty graph:");
console.log("Clone:", clone3);
// Expected: null

// Test 4: Two connected nodes
const adjList4 = [[2], [1]];
const graph4 = buildGraph(adjList4);
const clone4 = cloneGraph(graph4);
console.log("\nTest 4 - Two nodes:");
console.log("Original:", graphToAdjList(graph4, 2));
console.log("Clone:", graphToAdjList(clone4, 2));
// Expected: [[2],[1]]

// Test 5: Triangle graph
const adjList5 = [
  [2, 3],
  [1, 3],
  [1, 2],
];
const graph5 = buildGraph(adjList5);
const clone5 = cloneGraph(graph5);
console.log("\nTest 5 - Triangle graph:");
console.log("Original:", graphToAdjList(graph5, 3));
console.log("Clone:", graphToAdjList(clone5, 3));
// Expected: [[2,3],[1,3],[1,2]]

// Test 6: BFS approach
const clone6 = cloneGraphBFS(graph1);
console.log("\nTest 6 - BFS approach:");
console.log("Clone:", graphToAdjList(clone6, 4));
// Expected: [[2,4],[1,3],[2,4],[1,3]]
