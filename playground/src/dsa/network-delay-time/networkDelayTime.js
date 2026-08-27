function networkDelayTime(times, n, k) {
  // -------------------------------
  // Build adjacency list
  // -------------------------------
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) {
    graph[u].push([v, w]);
  }

  // -------------------------------
  // Distance array
  // -------------------------------
  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0;

  // -------------------------------
  // Min-Heap Priority Queue
  // Stores [distance, node]
  // -------------------------------
  const pq = new PriorityQueue((a, b) => a[0] < b[0]);
  pq.push([0, k]);

  // -------------------------------
  // Dijkstra
  // -------------------------------
  while (pq.size() > 0) {
    const [currDist, node] = pq.pop();

    // Skip stale heap entries
    if (currDist > dist[node]) continue;

    for (const [nei, weight] of graph[node]) {
      const newDist = currDist + weight;

      if (newDist < dist[nei]) {
        dist[nei] = newDist;
        pq.push([newDist, nei]);
      }
    }
  }

  // -------------------------------
  // Compute answer
  // -------------------------------
  let maxTime = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxTime = Math.max(maxTime, dist[i]);
  }

  return maxTime;
}
