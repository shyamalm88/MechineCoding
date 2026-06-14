/**
 * ============================================================================
 * PROBLEM: 0-1 BFS — Shortest Path in a Grid with Only {0, 1} Edge Costs
 * ============================================================================
 * Given a grid where grid[r][c] is the cost to ENTER cell (r, c), and that
 * cost is always 0 or 1, find the minimum total cost to travel from the
 * top-left corner (0,0) to the bottom-right corner (rows-1, cols-1), moving
 * 4-directionally. (0,0) itself costs nothing to start on.
 *
 * Example:
 * Input: grid = [[0,1],[1,0]]
 * Output: 1
 *
 * This is the classic "0-1 BFS" pattern: when every edge weight is 0 or 1,
 * a deque can replace a priority queue and still produce shortest distances
 * in O(V + E), instead of Dijkstra's O((V+E) log V).
 */

// ============================================================================
// APPROACH: Deque-based BFS (0-1 BFS / Dial's algorithm)
// ============================================================================
/**
 * STORY / INTUITION:
 * A normal BFS assumes every edge costs 1 — it can't tell a "free" move from
 * a "costly" one. A full Dijkstra with a heap would work but is overkill when
 * weights are only 0 or 1.
 *
 * The trick: use a DEQUE instead of a queue.
 * - When relaxing an edge of cost 0, push the neighbor to the FRONT (it's
 *   "free", so it should be explored before anything else already queued).
 * - When relaxing an edge of cost 1, push the neighbor to the BACK.
 *
 * This keeps the deque roughly sorted by distance at all times, so the first
 * time we pop a node we (eventually) have its true shortest distance — the
 * same guarantee Dijkstra gives, without a heap.
 *
 * DRY RUN: grid = [[0,1],[1,0]]
 *  dist[0][0]=0. deque=[(0,0)]
 *  Pop (0,0): neighbor (1,0) cost=grid[1][0]=1 -> dist=1, push BACK
 *             neighbor (0,1) cost=grid[0][1]=1 -> dist=1, push BACK
 *  deque=[(1,0),(0,1)]
 *  Pop (1,0): neighbor (1,1) cost=grid[1][1]=0 -> dist=1+0=1, push FRONT
 *  deque=[(1,1),(0,1)]
 *  Pop (1,1): destination, dist=1. No better update found from (0,1).
 *  Result: dist[1][1] = 1
 *
 * Time:  O(rows * cols) — each cell is pushed/relaxed a bounded number of
 *        times since weights are only 0 or 1.
 * Space: O(rows * cols) for the distance grid.
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

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== 0-1 BFS Shortest Path Tests ===\n");

console.log(
  "Test 1:",
  shortestPath01BFS([
    [0, 1],
    [1, 0],
  ]),
);
// Expected: 1

console.log(
  "Test 2 (free path around the costly center):",
  shortestPath01BFS([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]),
);
// Expected: 0

console.log(
  "Test 3 (only corners are free, everything else costs 1):",
  shortestPath01BFS([
    [0, 1, 1],
    [1, 1, 1],
    [1, 1, 0],
  ]),
);
// Expected: 3

module.exports = { shortestPath01BFS };
