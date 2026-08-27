function shortestDistance(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const totalDist = Array.from({ length: rows }, () => Array(cols).fill(0));
  const reachCount = Array.from({ length: rows }, () => Array(cols).fill(0));

  let buildingCount = 0;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // -------------------------------
  // BFS from each building
  // -------------------------------
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        buildingCount++;
        bfsFromBuilding(r, c);
      }
    }
  }

  // -------------------------------
  // Find minimum distance
  // -------------------------------
  let result = Infinity;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0 && reachCount[r][c] === buildingCount) {
        result = Math.min(result, totalDist[r][c]);
      }
    }
  }

  return result === Infinity ? -1 : result;

  // -------------------------------
  // BFS helper
  // -------------------------------
  function bfsFromBuilding(sr, sc) {
    const queue = [[sr, sc, 0]];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[sr][sc] = true;

    while (queue.length > 0) {
      const [r, c, dist] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (
          nr < 0 ||
          nr >= rows ||
          nc < 0 ||
          nc >= cols ||
          visited[nr][nc] ||
          grid[nr][nc] !== 0
        ) {
          continue;
        }

        visited[nr][nc] = true;
        totalDist[nr][nc] += dist + 1;
        reachCount[nr][nc] += 1;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
}
