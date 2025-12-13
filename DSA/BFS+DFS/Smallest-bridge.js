const shortestBridge = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let queue = [];
  let found = false;

  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) {
      return;
    }
    if (grid[r][c] !== 1) return;

    grid[r][c] = 2;
    queue.push([r, c, 0]);

    for (let [dr, dc] of directions) {
      dfs(r + dr, c + dc);
    }
  };

  for (let row = 0; row < rows && !found; row++) {
    for (let col = 0; col < cols && !found; col++) {
      if (grid[row][col] === 1) {
        dfs(row, col);
        found = true;
      }
    }
  }

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();
    for (const [dr, dc] of directions) {
      let nr = row + dr;
      let nc = col + dc;

      if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
      if (grid[nr][nc] == 1) return dist;

      if (grid[nr][nc] === 0) {
        grid[nr][nc] = 2;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
  return -1;
};
