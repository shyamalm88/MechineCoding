function swimInWater(grid) {
  const n = grid.length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // dist[r][c] = minimum max elevation to reach this cell
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));

  // Min-heap: [cost, r, c]
  const pq = new PriorityQueue((a, b) => a[0] < b[0]);

  dist[0][0] = grid[0][0];
  pq.push([grid[0][0], 0, 0]);

  while (pq.size() > 0) {
    const [currCost, r, c] = pq.pop();

    // Destination reached → optimal
    if (r === n - 1 && c === n - 1) {
      return currCost;
    }

    // Skip stale entry
    if (currCost > dist[r][c]) continue;

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;

      const nextCost = Math.max(currCost, grid[nr][nc]);

      if (nextCost < dist[nr][nc]) {
        dist[nr][nc] = nextCost;
        pq.push([nextCost, nr, nc]);
      }
    }
  }

  return -1;
}
