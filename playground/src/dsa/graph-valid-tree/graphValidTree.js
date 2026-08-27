function validTree(n, edges) {
  // Necessary condition: a tree must have exactly n - 1 edges
  if (edges.length !== n - 1) return false;

  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const visited = new Set();

  // DFS returns false if a cycle is detected
  function dfs(node, parent) {
    if (visited.has(node)) return false;

    visited.add(node);

    for (const neighbor of graph[node]) {
      if (neighbor === parent) continue; // ignore edge back to parent
      if (!dfs(neighbor, node)) return false;
    }

    return true;
  }

  // Start DFS from node 0
  if (!dfs(0, -1)) return false;

  // Ensure all nodes are connected
  return visited.size === n;
}
