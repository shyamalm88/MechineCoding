function maxProbability(n, edges, succProb, start, end) {
  // -------------------------------
  // Build adjacency list
  // -------------------------------
  const graph = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    const p = succProb[i];
    graph[u].push([v, p]);
    graph[v].push([u, p]);
  }

  // -------------------------------
  // Best probability array
  // -------------------------------
  const bestProb = Array(n).fill(0);
  bestProb[start] = 1;

  // -------------------------------
  // Max-Heap: higher probability first
  // -------------------------------
  const pq = new PriorityQueue((a, b) => a[0] > b[0]);
  pq.push([1, start]);

  // -------------------------------
  // Dijkstra
  // -------------------------------
  while (pq.size() > 0) {
    const [currProb, node] = pq.pop();

    // Early exit: best possible path to end found
    if (node === end) return currProb;

    // Skip stale entry
    if (currProb < bestProb[node]) continue;

    for (const [nei, edgeProb] of graph[node]) {
      const newProb = currProb * edgeProb;

      if (newProb > bestProb[nei]) {
        bestProb[nei] = newProb;
        pq.push([newProb, nei]);
      }
    }
  }

  return 0;
}
