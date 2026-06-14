/**
 * ============================================================================
 * PROBLEM: Shortest Path in a Weighted Grid (Minimum Path Sum, Dijkstra form)
 * ============================================================================
 * grid[r][c] = cost to ENTER cell (r, c). The starting cell's cost is paid
 * too. Find the minimum total cost to travel from (0,0) to (rows-1, cols-1),
 * moving in all 4 directions (not just right/down).
 *
 * Example:
 * Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
 * Output: 7   (path 1 -> 3 -> 1 -> 1 -> 1, going right, right, down, down)
 *
 * Note: because all 4 directions are allowed (unlike the classic
 * right/down-only "Minimum Path Sum"), this needs Dijkstra rather than a
 * simple DP table.
 */

// ============================================================================
// APPROACH: Dijkstra's Algorithm with a Binary Min-Heap
// ============================================================================
/**
 * STORY / INTUITION:
 * Since every cell cost is non-negative and we can move in any of the 4
 * directions, this is a textbook Dijkstra: treat each cell as a graph node,
 * and the cost to move to a neighbor is that neighbor's grid value.
 *
 * Pop the cheapest known (cost, r, c) from the heap. If it's stale (a
 * cheaper path to (r,c) was already finalized), skip it. Otherwise relax all
 * 4 neighbors.
 *
 * DRY RUN: grid = [[1,3,1],[1,5,1],[4,2,1]]
 *  dist[0][0]=1. heap=[(1,0,0)]
 *  Pop (1,0,0). Relax (0,1)->1+3=4, (1,0)->1+1=2
 *  Pop (2,1,0). Relax (2,0)->2+4=6, (1,1)->2+5=7
 *  Pop (4,0,1). Relax (0,2)->4+1=5, (1,1)->4+5=9 (worse, skip)
 *  Pop (5,0,2). Relax (1,2)->5+1=6
 *  Pop (6,1,2). destination not yet (rows-1=2). Relax (2,2)->6+1=7
 *  Pop (6,2,0). Relax (2,1)->6+2=8 (worse than nothing yet)
 *  Pop (7,1,1) stale-ish... eventually Pop (7,2,2) -> destination, return 7
 *
 * Time:  O(V log V + E log V) = O(rows*cols*log(rows*cols))
 * Space: O(rows*cols) for dist[][] and the heap.
 */
class MinHeap {
  constructor() {
    this.data = [];
  }

  push(item) {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }

  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._bubbleDown(0);
    }
    return top;
  }

  isEmpty() {
    return this.data.length === 0;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent][0] <= this.data[i][0]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  _bubbleDown(i) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && this.data[left][0] < this.data[smallest][0]) smallest = left;
      if (right < n && this.data[right][0] < this.data[smallest][0]) smallest = right;

      if (smallest === i) break;
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}

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
  const pq = new MinHeap();

  // Start position
  dist[0][0] = grid[0][0];
  pq.push([grid[0][0], 0, 0]);

  while (!pq.isEmpty()) {
    const [cost, r, c] = pq.pop();

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
        pq.push([newCost, nr, nc]);
      }
    }
  }

  return -1; // unreachable
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Shortest Path with Costs (Dijkstra on Grid) Tests ===\n");

console.log(
  "Test 1:",
  shortestPathWithCosts([
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ]),
);
// Expected: 7

console.log("Test 2 (1x1 grid):", shortestPathWithCosts([[5]]));
// Expected: 5

console.log(
  "Test 3:",
  shortestPathWithCosts([
    [1, 2, 3],
    [4, 5, 6],
  ]),
);
// Expected: 12 (path 1 -> 2 -> 3 -> 6)

module.exports = { shortestPathWithCosts };
