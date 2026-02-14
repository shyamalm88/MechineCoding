/**
 * ============================================================================
 * PROBLEM: Find Valid Root for Binary Tree with Color Sequence
 * ============================================================================
 *
 * Given an undirected graph (representing a tree structure) with N nodes,
 * where each node has a specific color. We are also given a repeating color
 * sequence (e.g., ['R', 'G']).
 *
 * We need to find a node `root` such that if we root the tree at this node:
 * 1. The tree becomes a Binary Tree (every node has at most 2 children).
 * 2. The colors of the nodes level-by-level match the given sequence pattern.
 *    - Level 0 node must match sequence[0]
 *    - Level 1 nodes must match sequence[1]
 *    - Level k nodes must match sequence[k % sequence.length]
 *
 * Return the index of the valid root, or -1 if none exists.
 *
 * ============================================================================
 * INTUITION: Brute Force BFS
 * ============================================================================
 *
 * Since the tree structure (parent-child relationships) and levels depend
 * entirely on which node we choose as the root, we can try every node.
 *
 * Algorithm:
 * 1. Iterate through every node `i` from 0 to n-1.
 * 2. Optimization: If `i` has > 2 neighbors, it cannot be a binary tree root
 *    (a root has no parent, so all neighbors are children).
 * 3. Run BFS from `i`:
 *    - Check color match: `colors[u] == sequence[depth % len]`
 *    - Check binary property: Count children (unvisited neighbors). If > 2, fail.
 * 4. If BFS completes without issues, `i` is our answer.
 *
 * Time Complexity: O(N^2) - BFS takes O(N) and we run it N times.
 * Space Complexity: O(N) - Queue and Visited set.
 */

// ============================================================================
// DRY RUN
// ============================================================================
/*
  Graph: 0 -- 1 -- 2
              |
              3

  Colors:   0:R, 1:G, 2:R, 3:R
  Sequence: ['R', 'G']

  Attempt Root = 0:
  1. Start BFS(0). Depth 0.
     - Color Check: colors[0] (R) == seq[0%2] (R). OK.
     - Neighbors: [1]. Unvisited: 1. Children: 1. OK.
     - Queue: [[1, 1]]

  2. Pop 1. Depth 1.
     - Color Check: colors[1] (G) == seq[1%2] (G). OK.
     - Neighbors: [0, 2, 3]. Unvisited: 2, 3. Children: 2. OK.
     - Queue: [[2, 2], [3, 2]]

  3. Pop 2. Depth 2.
     - Color Check: colors[2] (R) == seq[2%2] (R). OK.
     - Neighbors: [1]. Unvisited: None. Children: 0. OK.

  4. Pop 3. Depth 2.
     - Color Check: colors[3] (R) == seq[2%2] (R). OK.
     - Neighbors: [1]. Unvisited: None. Children: 0. OK.

  BFS Complete -> Return True. Root 0 is valid.
*/

/**
 * Finds a valid root that satisfies:
 * 1) Binary tree constraint (≤ 2 children)
 * 2) Color sequence constraint by depth
 *
 * @param {number} n
 * @param {number[][]} adj - undirected adjacency list
 * @param {string[]} colors - color of each node
 * @param {string[]} sequence - repeating color pattern
 * @return {number} valid root index or -1
 */
function motherVertexDirectedGraph(n, adj, colors, sequence) {
  for (let root = 0; root < n; root++) {
    // Root has no parent, so its degree = number of children
    if (adj[root].length > 2) continue;

    if (isValidRoot(root, adj, colors, sequence)) {
      return root;
    }
  }
  return -1;
}

/**
 * Validates whether choosing `root` satisfies all constraints.
 */
function isValidRoot(root, adj, colors, sequence) {
  const visited = new Array(adj.length).fill(false);
  const queue = [[root, 0]]; // [node, depth]
  visited[root] = true;

  const seqLen = sequence.length;

  while (queue.length > 0) {
    const [node, depth] = queue.shift();

    // Color constraint
    if (colors[node] !== sequence[depth % seqLen]) {
      return false;
    }

    let children = 0;

    for (const nei of adj[node]) {
      if (!visited[nei]) {
        visited[nei] = true;
        children++;

        // Binary tree constraint
        if (children > 2) return false;

        queue.push([nei, depth + 1]);
      }
    }
  }

  // Ensure graph is fully connected from root
  for (let i = 0; i < visited.length; i++) {
    if (!visited[i]) return false;
  }

  return true;
}
