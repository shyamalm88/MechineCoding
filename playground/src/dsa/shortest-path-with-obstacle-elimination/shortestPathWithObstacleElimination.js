function shortestPath(grid, k) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Edge case: start == end
  if (rows === 1 && cols === 1) return 0;

  // visited[r][c][remainingK]
  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Array(k + 1).fill(false)),
  );

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = [[0, 0, k, 0]]; // r, c, remainingK, steps
  visited[0][0][k] = true;

  // -------------------------------
  // BFS
  // -------------------------------
  while (queue.length > 0) {
    const [r, c, remainingK, steps] = queue.shift();

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      // Destination reached
      if (nr === rows - 1 && nc === cols - 1) {
        return steps + 1;
      }

      const nextRemainingK = remainingK - grid[nr][nc];

      if (nextRemainingK >= 0 && !visited[nr][nc][nextRemainingK]) {
        visited[nr][nc][nextRemainingK] = true;
        queue.push([nr, nc, nextRemainingK, steps + 1]);
      }
    }
  }

  return -1;
}
