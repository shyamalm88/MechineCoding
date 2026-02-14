/**
 * ============================================================================
 * PROBLEM: Minimum Cost to Make at Least One Valid Path (LeetCode #1368)
 * CATEGORY: 🔴 VVIMP (0–1 BFS / Dijkstra Optimization)
 * ============================================================================
 *
 * You are given an m x n grid.
 *
 * Each cell has a direction:
 * - 1 → right
 * - 2 → left
 * - 3 → down
 * - 4 → up
 *
 * You start at (0,0) and want to reach (m-1,n-1).
 *
 * Following the arrow in a cell costs 0.
 * Changing direction (i.e., ignoring the arrow) costs 1.
 *
 * Return the MINIMUM cost to make at least one valid path.
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   grid = [
 *     [1,1,3],
 *     [3,2,2],
 *     [1,1,4]
 *   ]
 *
 *   One optimal path costs 1.
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= m, n <= 100
 *
 * ============================================================================
 * INTUITION: Why This Problem Is Tricky
 * ============================================================================
 *
 * At first glance:
 *   "This is just BFS on a grid."
 *
 * But there's a twist:
 * - Some moves cost 0
 * - Some moves cost 1
 *
 * Key Insight (CRITICAL):
 *
 *   This is a shortest-path problem with edge weights ∈ {0, 1}.
 *
 * That immediately suggests:
 *   ➤ 0–1 BFS
 *
 * You CAN use Dijkstra,
 * but 0–1 BFS is faster and cleaner.
 *
 * ============================================================================
 * GRAPH MODELING
 * ============================================================================
 *
 * Each cell is a node.
 *
 * From each cell, you have up to 4 outgoing edges:
 * - One edge with cost 0 (following the arrow)
 * - Three edges with cost 1 (changing direction)
 *
 * Goal:
 * - Reach bottom-right with minimum cost
 *
 * ============================================================================
 * WHY 0–1 BFS WORKS
 * ============================================================================
 *
 * In 0–1 BFS:
 * - Cost 0 edges → push to FRONT of deque
 * - Cost 1 edges → push to BACK of deque
 *
 * This guarantees:
 * - Nodes are processed in increasing cost order
 * - Same invariant as Dijkstra, but cheaper
 *
 * ============================================================================
 * ALGORITHM (0–1 BFS)
 * ============================================================================
 *
 * 1. dist[r][c] = minimum cost to reach (r,c)
 * 2. Initialize dist[0][0] = 0
 * 3. Use a deque instead of priority queue
 * 4. For each move:
 *      - cost = 0 if direction matches arrow
 *      - cost = 1 otherwise
 * 5. Update dist and push accordingly
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - R = rows, C = cols
 *
 * Time:  O(R × C)
 * Space: O(R × C)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔴 VVIMP
 * ============================================================================
 *
 * Interviewers are testing:
 * - Do you recognize 0–1 BFS?
 * - Can you explain why Dijkstra is overkill?
 * - Can you map problem constraints to algorithm choice?
 *
 * This problem tests PURE algorithmic maturity.
 * ============================================================================
 */

function minCost(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [0, 1], // right (1)
    [0, -1], // left  (2)
    [1, 0], // down  (3)
    [-1, 0], // up    (4)
  ];

  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

  // Deque for 0–1 BFS
  const deque = [];
  dist[0][0] = 0;
  deque.push([0, 0]);

  while (deque.length > 0) {
    const [r, c] = deque.shift();

    for (let i = 0; i < 4; i++) {
      const [dr, dc] = directions[i];
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      // If direction matches arrow, cost = 0, else cost = 1
      const cost = grid[r][c] === i + 1 ? 0 : 1;
      const newDist = dist[r][c] + cost;

      if (newDist < dist[nr][nc]) {
        dist[nr][nc] = newDist;

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
