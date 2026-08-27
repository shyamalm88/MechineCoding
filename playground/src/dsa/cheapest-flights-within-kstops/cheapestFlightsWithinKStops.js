function findCheapestPrice(n, flights, src, dst, k) {
  // -------------------------------
  // Build adjacency list
  // -------------------------------
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, price] of flights) {
    graph[u].push([v, price]);
  }

  // -------------------------------
  // cost[city][stops] = min cost
  // -------------------------------
  const cost = Array.from({ length: n }, () => Array(k + 2).fill(Infinity));
  cost[src][0] = 0;

  // -------------------------------
  // Min-Heap: [cost, city, stops]
  // -------------------------------
  const pq = new PriorityQueue((a, b) => a[0] < b[0]);
  pq.push([0, src, 0]);

  // -------------------------------
  // Dijkstra with state
  // -------------------------------
  while (pq.size() > 0) {
    const [currCost, city, stops] = pq.pop();

    // Destination reached with valid stops
    if (city === dst) return currCost;

    // Stop constraint violated
    if (stops > k) continue;

    // Skip stale entries
    if (currCost > cost[city][stops]) continue;

    for (const [nei, price] of graph[city]) {
      const nextCost = currCost + price;
      const nextStops = stops + 1;

      if (nextCost < cost[nei][nextStops]) {
        cost[nei][nextStops] = nextCost;
        pq.push([nextCost, nei, nextStops]);
      }
    }
  }

  return -1;
}
