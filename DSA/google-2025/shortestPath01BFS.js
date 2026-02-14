/**
 * grid[r][c] = 0 (free) or 1 (costly)
 */
function shortestPath01BFS(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

  const deque = [];
  dist[0][0] = 0;
  deque.push([0, 0]);

  while (deque.length) {
    const [r, c] = deque.shift();

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      const cost = grid[nr][nc]; // 0 or 1
      if (dist[r][c] + cost < dist[nr][nc]) {
        dist[nr][nc] = dist[r][c] + cost;
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
