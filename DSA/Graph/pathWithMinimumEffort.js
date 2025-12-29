const pathWithMinimumEffort = (grid) => {
  let left = 0;
  let right = 1000000; // fixed
  let ans = right;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canReach(grid, mid)) {
      ans = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return ans;

  function canReach(grid, effort) {
    let row = grid.length;
    let col = grid[0].length;

    let visited = Array.from({ length: row }, () => new Array(col).fill(false));

    const dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];

    const dfs = (r, c) => {
      if (r === row - 1 && c === col - 1) return true;

      visited[r][c] = true;

      for (let [dr, dc] of dirs) {
        let nr = r + dr;
        let nc = c + dc;

        if (nr < 0 || nc < 0 || nr >= row || nc >= col || visited[nr][nc])
          continue;

        if (Math.abs(grid[r][c] - grid[nr][nc]) <= effort) {
          if (dfs(nr, nc)) return true;
        }
      }
      return false;
    };

    return dfs(0, 0);
  }
};
