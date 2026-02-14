/**
 * Dynamic Number of Islands (Online)
 * Time: O(k * α(n)) ~ O(k)
 * Space: O(m * n)
 */
function numIslands2(m, n, positions) {
  const parent = new Array(m * n).fill(-1);
  const rank = new Array(m * n).fill(0);
  const grid = Array.from({ length: m }, () => Array(n).fill(0));

  let count = 0;
  const result = [];

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // path compression
    }
    return parent[x];
  };

  const union = (x, y) => {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX === rootY) return false;

    // union by rank
    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }

    return true;
  };

  for (const [r, c] of positions) {
    // If already land, island count doesn't change
    if (grid[r][c] === 1) {
      result.push(count);
      continue;
    }

    grid[r][c] = 1;
    count++;

    const idx = r * n + c;
    parent[idx] = idx;

    // Try to union with neighbors
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] === 1) {
        const neighborIdx = nr * n + nc;
        if (union(idx, neighborIdx)) {
          count--; // merged two islands
        }
      }
    }

    result.push(count);
  }

  return result;
}
