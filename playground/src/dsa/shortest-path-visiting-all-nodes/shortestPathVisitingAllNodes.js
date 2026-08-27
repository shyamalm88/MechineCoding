function shortestPathLength(graph) {
  const n = graph.length;
  const fullMask = (1 << n) - 1;

  // visited[node][mask]
  const visited = Array.from({ length: n }, () => Array(1 << n).fill(false));

  const queue = [];

  // -------------------------------
  // Multi-source BFS initialization
  // -------------------------------
  for (let i = 0; i < n; i++) {
    const mask = 1 << i;
    queue.push([i, mask, 0]); // node, mask, steps
    visited[i][mask] = true;
  }

  // -------------------------------
  // BFS
  // -------------------------------
  while (queue.length > 0) {
    const [node, mask, steps] = queue.shift();

    if (mask === fullMask) return steps;

    for (const nei of graph[node]) {
      const nextMask = mask | (1 << nei);

      if (!visited[nei][nextMask]) {
        visited[nei][nextMask] = true;
        queue.push([nei, nextMask, steps + 1]);
      }
    }
  }

  return -1;
}
