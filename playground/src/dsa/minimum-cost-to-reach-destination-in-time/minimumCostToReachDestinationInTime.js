function minCost(maxTime, edges, passingFees) {
  const n = passingFees.length;

  // -------------------------------
  // Build adjacency list
  // -------------------------------
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    graph[u].push([v, t]);
    graph[v].push([u, t]);
  }

  // -------------------------------
  // cost[city][time] = min cost
  // -------------------------------
  const cost = Array.from({ length: n }, () =>
    Array(maxTime + 1).fill(Infinity),
  );
  cost[0][0] = passingFees[0];

  // -------------------------------
  // Min-heap: [totalCost, city, time]
  // -------------------------------
  const pq = new PriorityQueue((a, b) => a[0] < b[0]);
  pq.push([passingFees[0], 0, 0]);

  // -------------------------------
  // Dijkstra with state pruning
  // -------------------------------
  while (pq.size() > 0) {
    const [currCost, city, timeSpent] = pq.pop();

    // Destination reached optimally
    if (city === n - 1) return currCost;

    // Skip stale entry
    if (currCost > cost[city][timeSpent]) continue;

    for (const [nei, travelTime] of graph[city]) {
      const newTime = timeSpent + travelTime;
      if (newTime > maxTime) continue;

      const newCost = currCost + passingFees[nei];
      if (newCost < cost[nei][newTime]) {
        cost[nei][newTime] = newCost;
        pq.push([newCost, nei, newTime]);
      }
    }
  }

  return -1;
}
