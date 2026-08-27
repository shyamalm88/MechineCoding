function shortestAlternatingPaths(n, redEdges, blueEdges) {
  // -------------------------------
  // Build adjacency lists by color
  // -------------------------------
  const redGraph = Array.from({ length: n }, () => []);
  const blueGraph = Array.from({ length: n }, () => []);

  for (const [u, v] of redEdges) redGraph[u].push(v);
  for (const [u, v] of blueEdges) blueGraph[u].push(v);

  // distance[node][0] = last edge was RED
  // distance[node][1] = last edge was BLUE
  const RED = 0;
  const BLUE = 1;

  const dist = Array.from({ length: n }, () => [Infinity, Infinity]);

  // -------------------------------
  // BFS initialization
  // -------------------------------
  const queue = [];
  dist[0][RED] = 0;
  dist[0][BLUE] = 0;
  queue.push([0, RED]);
  queue.push([0, BLUE]);

  // -------------------------------
  // BFS traversal
  // -------------------------------
  while (queue.length > 0) {
    const [node, lastColor] = queue.shift();
    const currDist = dist[node][lastColor];

    if (lastColor === RED) {
      // Next edge must be BLUE
      for (const nei of blueGraph[node]) {
        if (dist[nei][BLUE] === Infinity) {
          dist[nei][BLUE] = currDist + 1;
          queue.push([nei, BLUE]);
        }
      }
    } else {
      // Next edge must be RED
      for (const nei of redGraph[node]) {
        if (dist[nei][RED] === Infinity) {
          dist[nei][RED] = currDist + 1;
          queue.push([nei, RED]);
        }
      }
    }
  }

  // -------------------------------
  // Build result
  // -------------------------------
  const result = Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    const best = Math.min(dist[i][RED], dist[i][BLUE]);
    if (best !== Infinity) result[i] = best;
  }

  return result;
}
