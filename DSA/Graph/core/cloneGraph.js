/**
 * ============================================================================
 * PROBLEM: Clone Graph (LeetCode #133)
 * ============================================================================
 *
 * Given a reference of a node in a connected undirected graph, return a
 * deep copy (clone) of the graph.
 *
 * Each node in the graph contains:
 *   - val (int): The node's value
 *   - neighbors (Node[]): A list of its neighbors
 *
 * Test case format:
 * The graph is represented as an adjacency list where index = node value.
 * Each node in the graph has a unique value (1, 2, 3, ..., n).
 *
 * Example 1:
 *
 *      1 ---- 2
 *      |      |
 *      |      |
 *      4 ---- 3
 *
 * Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
 * Output: [[2,4],[1,3],[2,4],[1,3]]
 * Explanation: Node 1 connects to 2 and 4
 *              Node 2 connects to 1 and 3
 *              Node 3 connects to 2 and 4
 *              Node 4 connects to 1 and 3
 *
 * Example 2:
 * Input: adjList = [[]]
 * Output: [[]]
 * Explanation: One node with no neighbors
 *
 * Example 3:
 * Input: adjList = []
 * Output: []
 * Explanation: Empty graph
 *
 * Constraints:
 * - Number of nodes: [0, 100]
 * - 1 <= Node.val <= 100
 * - Node.val is unique for each node
 * - No repeated edges or self-loops
 * - Graph is connected (all nodes reachable from given node)
 *
 * ============================================================================
 * INTUITION: DFS with HashMap (Clone as you traverse)
 * ============================================================================
 *
 * Why use a HashMap?
 * - We need to track which nodes we've already cloned
 * - Map: original node -> cloned node
 * - Prevents infinite loops (graph has cycles!)
 * - Ensures same node isn't cloned twice
 *
 * Algorithm:
 * 1. If node is null, return null
 * 2. If node already cloned (in map), return the clone
 * 3. Create clone of current node
 * 4. Store in map BEFORE recursing (handles cycles!)
 * 5. Recursively clone all neighbors
 * 6. Return the clone
 *
 * Key Insight:
 * - We MUST add to map BEFORE processing neighbors
 * - Otherwise, cycles will cause infinite recursion
 *
 *   Original: 1 <-> 2    When cloning 1:
 *                        1. Clone node 1, add to map
 *                        2. Clone neighbor 2
 *                        3. Clone neighbor 1 of 2 -> found in map! Return clone.
 *
 * Time Complexity: O(N + E) - visit each node and edge once
 * Space Complexity: O(N) - HashMap stores N nodes + recursion stack
 * ============================================================================
 */

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
// ALTERNATIVE: BFS Approach
// ============================================================================
const cloneGraphBFS = (node) => {
  if (!node) return null;

  const map = new Map();
  const queue = [node];

  // Create clone of starting node
  map.set(node, new Node(node.val));

  while (queue.length > 0) {
    const curr = queue.shift();

    for (let neighbor of curr.neighbors) {
      // If neighbor not cloned yet, clone it
      if (!map.has(neighbor)) {
        map.set(neighbor, new Node(neighbor.val));
        queue.push(neighbor);
      }
      // Connect clone's neighbor to cloned neighbor
      map.get(curr).neighbors.push(map.get(neighbor));
    }
  }

  return map.get(node);
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
