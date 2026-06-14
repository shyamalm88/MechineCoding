/**
 * ============================================================================
 * PROBLEM: Number of Islands II (LeetCode #305)
 * ============================================================================
 * You are given an m x n binary grid, initially all 0 (water). You are also
 * given an array `positions` where positions[i] = [ri, ci] turns that cell
 * into 1 (land), one operation at a time.
 *
 * After each operation, return the number of islands. An island is a maximal
 * group of 1's connected 4-directionally.
 *
 * Example:
 * Input: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]
 * Output: [1,1,2,3]
 *
 * Constraints:
 * 1 <= m, n, positions.length <= 10^4
 * positions[i].length == 2
 * 0 <= ri < m, 0 <= ci < n
 */

// ============================================================================
// APPROACH: Union-Find (Disjoint Set Union) with online updates
// ============================================================================
/**
 * STORY / INTUITION:
 * Re-running BFS/DFS after every single land addition would be O(k * m * n)
 * — too slow for online updates. Instead, maintain a Union-Find over all
 * m*n cells, plus a running `count` of islands.
 *
 * When a cell turns to land:
 * - If it's already land (duplicate position), the count doesn't change.
 * - Otherwise, count++ (a brand new island), then for each of its 4
 *   neighbors that is already land, union with it. Each successful union
 *   merges two previously-separate islands, so count--.
 *
 * DRY RUN: m=3, n=3, positions=[[0,0],[0,1],[1,2],[2,1]]
 *  (0,0): new island. count=1                       -> result=[1]
 *  (0,1): new island (count=2). neighbor (0,0) is land -> union, count=1
 *                                                    -> result=[1,1]
 *  (1,2): new island (count=2). no land neighbors    -> result=[1,1,2]
 *  (2,1): new island (count=3). no land neighbors    -> result=[1,1,2,3]
 *
 * Time:  O(k * α(m*n)) for k positions (α = inverse Ackermann, ~O(1))
 * Space: O(m * n) for the Union-Find arrays and grid.
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

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Number of Islands II Tests ===\n");

console.log(
  "Test 1:",
  numIslands2(3, 3, [
    [0, 0],
    [0, 1],
    [1, 2],
    [2, 1],
  ]),
);
// Expected: [1, 1, 2, 3]

console.log(
  "Test 2 (duplicate position):",
  numIslands2(3, 3, [
    [0, 0],
    [0, 0],
  ]),
);
// Expected: [1, 1]

console.log(
  "Test 3 (fully merges into one island):",
  numIslands2(2, 2, [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]),
);
// Expected: [1, 1, 1, 1]

module.exports = { numIslands2 };
