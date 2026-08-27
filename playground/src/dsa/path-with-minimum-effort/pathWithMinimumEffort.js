/**
 * ============================================================================
 * APPROACH: Dijkstra / Priority Queue (Minimize the Maximum Edge)
 * ============================================================================
 *
 * INTUITION:
 *
 * This is a shortest-path problem with a NON-STANDARD cost definition.
 *
 * - Moving between two adjacent cells has a "cost":
 *     |height[current] - height[next]|
 * - The total cost of a path is NOT the sum of costs,
 *   but the MAXIMUM cost encountered along the path.
 *
 * Key Observation:
 * - As we extend a path, the effort (max edge so far) NEVER decreases.
 * - This monotonic property allows Dijkstra’s algorithm to work.
 *
 * Instead of minimizing SUM of edges, we minimize:
 *
 *   max(edge_1, edge_2, ..., edge_k)
 *
 * ---------------------------------------------------------------------------
 * STATE:
 *
 * - Each cell (r, c) is a node
 * - dist[r][c] = minimum possible effort to reach (r, c)
 *
 * ---------------------------------------------------------------------------
 * EDGE RELAXATION:
 *
 * From (r, c) → (nr, nc):
 *
 *   edgeEffort = |heights[r][c] - heights[nr][nc]|
 *   newEffort  = max(dist[r][c], edgeEffort)
 *
 * If newEffort < dist[nr][nc], update it.
 *
 * ---------------------------------------------------------------------------
 * ALGORITHM:
 *
 * 1. Initialize dist[][] with Infinity
 * 2. dist[0][0] = 0
 * 3. Push (0, 0, 0) into min-heap → [effort, row, col]
 * 4. While heap is not empty:
 *    a. Pop cell with minimum effort so far
 *    b. If it is destination, return effort
 *    c. Relax all valid neighbors
 *
 * ---------------------------------------------------------------------------
 * TIME COMPLEXITY:
 *
 * - Each cell is processed at most once with its best effort
 * - Heap operations: O(log(R * C))
 *
 * Total: O(R * C * log(R * C))
 *
 * ---------------------------------------------------------------------------
 * SPACE COMPLEXITY:
 *
 * - dist array: O(R * C)
 * - priority queue: O(R * C)
 *
 * ============================================================================
 */

const pathWithMinimumEffort = (heights) => {
  const rows = heights.length;
  const cols = heights[0].length;

  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

  // Min-Heap: [currentEffort, row, col]
  const pq = new PriorityQueue((a, b) => a[0] < b[0]);

  dist[0][0] = 0;
  pq.push([0, 0, 0]);

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (pq.size() > 0) {
    const [effort, r, c] = pq.pop();

    // If we reached destination, this is the minimum effort
    if (r === rows - 1 && c === cols - 1) {
      return effort;
    }

    // Skip stale entries
    if (effort > dist[r][c]) continue;

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      const edgeEffort = Math.abs(heights[r][c] - heights[nr][nc]);

      const newEffort = Math.max(effort, edgeEffort);

      if (newEffort < dist[nr][nc]) {
        dist[nr][nc] = newEffort;
        pq.push([newEffort, nr, nc]);
      }
    }
  }

  // Problem guarantees reachability
  return 0;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Path With Minimum Effort Tests ===\n");

// Test 1
console.log(
  "Test 1:",
  pathWithMinimumEffort([
    [1, 2, 2],
    [3, 8, 2],
    [5, 3, 5],
  ]),
);
// Expected: 2

// Test 2
console.log(
  "Test 2:",
  pathWithMinimumEffort([
    [1, 2, 3],
    [3, 8, 4],
    [5, 3, 5],
  ]),
);
// Expected: 1

// Test 3
console.log(
  "Test 3:",
  pathWithMinimumEffort([
    [1, 2, 1, 1, 1],
    [1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1],
    [1, 1, 1, 2, 1],
  ]),
);
// Expected: 0

module.exports = { pathWithMinimumEffort };
