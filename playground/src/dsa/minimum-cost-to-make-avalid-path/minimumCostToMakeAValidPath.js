function minCost(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [0, 1], // right (1)
    [0, -1], // left  (2)
    [1, 0], // down  (3)
    [-1, 0], // up    (4)
  ];

  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

  // Deque for 0–1 BFS
  const deque = [];
  dist[0][0] = 0;
  deque.push([0, 0]);

  while (deque.length > 0) {
    const [r, c] = deque.shift();

    for (let i = 0; i < 4; i++) {
      const [dr, dc] = directions[i];
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      // If direction matches arrow, cost = 0, else cost = 1
      const cost = grid[r][c] === i + 1 ? 0 : 1;
      const newDist = dist[r][c] + cost;

      if (newDist < dist[nr][nc]) {
        dist[nr][nc] = newDist;

        if (cost === 0) {
          deque.unshift([nr, nc]);
        } else {
          deque.push([nr, nc]);
        }
      }
    }
  }

  return dist[rows - 1][cols - 1];
}
