function findRedundantConnection(edges) {
  const graph = new Map();

  function dfs(curr, target, visited) {
    if (curr === target) return true;
    visited.add(curr);

    for (const nei of graph.get(curr) || []) {
      if (!visited.has(nei)) {
        if (dfs(nei, target, visited)) return true;
      }
    }
    return false;
  }

  for (const [u, v] of edges) {
    if (graph.has(u) && graph.has(v)) {
      if (dfs(u, v, new Set())) {
        return [u, v];
      }
    }

    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u).push(v);
    graph.get(v).push(u);
  }

  return [];
}
