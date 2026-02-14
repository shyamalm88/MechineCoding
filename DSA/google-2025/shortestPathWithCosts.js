/**
 * Shortest path in grid with movement costs
 *
 * grid[r][c] = cost to ENTER cell (r,c)
 * Start at (0,0), end at (rows-1, cols-1)
 */
function shortestPathWithCosts(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [1, 0], // down
    [-1, 0], // up
    [0, 1], // right
    [0, -1], // left
  ];

  // Distance matrix
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

  // Min-heap: [totalCost, row, col]
  const pq = new MinPriorityQueue({
    priority: (x) => x[0],
  });

  // Start position
  dist[0][0] = grid[0][0];
  pq.enqueue([grid[0][0], 0, 0]);

  while (!pq.isEmpty()) {
    const [cost, r, c] = pq.dequeue().element;

    // Skip outdated entry
    if (cost > dist[r][c]) continue;

    // Destination reached
    if (r === rows - 1 && c === cols - 1) {
      return cost;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      const newCost = cost + grid[nr][nc];

      if (newCost < dist[nr][nc]) {
        dist[nr][nc] = newCost;
        pq.enqueue([newCost, nr, nc]);
      }
    }
  }

  return -1; // unreachable
}
