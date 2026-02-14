/**
 * ============================================================================
 * PROBLEM: Shortest Path with Teleport / One-Time Power
 * CATEGORY: 🔴 VVIMP (State-Space Shortest Path + Greedy Ordering)
 * ============================================================================
 *
 * You are given a grid (or graph) where:
 * - You can move normally (cost = 1 per move)
 * - You have a ONE-TIME special power (teleport / cheat / jump)
 *
 * Teleport rules (generic form used in interviews):
 * - You may use the teleport AT MOST ONCE
 * - When used, it allows you to move in a special way
 *   (skip a cell, ignore an obstacle, jump to a neighbor, etc.)
 *
 * Goal:
 * - Reach destination in MINIMUM steps
 *
 * NOTE:
 * - The exact teleport mechanics may vary across problems
 * - The CORE difficulty is always STATE MODELING
 *
 * ============================================================================
 * INTUITION: Why This Problem Is HARD
 * ============================================================================
 *
 * This problem breaks the biggest beginner assumption:
 *
 *   "A node is just a node."
 *
 * Key Insight (CRITICAL):
 *
 *   Reaching the SAME position with teleport UNUSED
 *   vs
 *   Reaching the SAME position with teleport USED
 *
 *   → These are DIFFERENT STATES.
 *
 * Because:
 * - Teleport-unused state has MORE future options
 * - Teleport-used state has FEWER future options
 *
 * A simple visited[r][c] is WRONG.
 *
 * ============================================================================
 * STATE MODELING (THIS IS THE ENTIRE PROBLEM)
 * ============================================================================
 *
 * State = (row, col, usedTeleport)
 *
 * where:
 * - usedTeleport = 0 → teleport still available
 * - usedTeleport = 1 → teleport already consumed
 *
 * We want:
 * - Shortest path to destination
 * - In ANY valid state
 *
 * ============================================================================
 * ALGORITHM CHOICE
 * ============================================================================
 *
 * Because:
 * - Normal move cost = 1
 * - Teleport move cost = 0 or 1 (depends on problem)
 *
 * We typically use:
 * - 0-1 BFS (deque), OR
 * - Dijkstra (priority queue)
 *
 * Here, we show the GENERAL Dijkstra-style solution
 * that works for all variants.
 *
 * ============================================================================
 * ALGORITHM (Dijkstra with State)
 * ============================================================================
 *
 * 1. State: (r, c, usedTeleport)
 * 2. dist[r][c][usedTeleport] = minimum steps to reach this state
 * 3. Min-heap stores:
 *      [steps, r, c, usedTeleport]
 *
 * 4. From each state:
 *      a. Normal moves:
 *           → cost +1, same usedTeleport
 *      b. Teleport move (if usedTeleport == 0):
 *           → cost + TELEPORT_COST
 *           → usedTeleport becomes 1
 *
 * 5. First time reaching destination is optimal
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - R = rows, C = cols
 *
 * States = R × C × 2
 *
 * Time:  O(R × C log (R × C))
 * Space: O(R × C)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔴 VVIMP
 * ============================================================================
 *
 * Interviewers are testing:
 * - Do you understand that "state" defines the graph?
 * - Can you resist using visited[r][c]?
 * - Can you explain WHY teleport-unused is better than teleport-used?
 *
 * Many senior candidates FAIL here.
 * Staff-level candidates get this right cleanly.
 * ============================================================================
 */

function shortestPathWithOneTeleport(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // dist[r][c][usedTeleport]
  const dist = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => [Infinity, Infinity]),
  );

  // Min-heap: [steps, r, c, usedTeleport]
  const pq = new PriorityQueue((a, b) => a[0] < b[0]);

  // Start at (0,0) with teleport unused
  dist[0][0][0] = 0;
  pq.push([0, 0, 0, 0]);

  while (pq.size() > 0) {
    const [steps, r, c, usedTeleport] = pq.pop();

    // Destination reached → optimal
    if (r === rows - 1 && c === cols - 1) {
      return steps;
    }

    // Skip stale state
    if (steps > dist[r][c][usedTeleport]) continue;

    // -------------------------------
    // Normal moves (cost = 1)
    // -------------------------------
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] === 1) continue; // obstacle

      const nextSteps = steps + 1;
      if (nextSteps < dist[nr][nc][usedTeleport]) {
        dist[nr][nc][usedTeleport] = nextSteps;
        pq.push([nextSteps, nr, nc, usedTeleport]);
      }
    }

    // -------------------------------
    // Teleport move (ONE-TIME)
    // -------------------------------
    if (usedTeleport === 0) {
      // Example teleport: jump over ONE obstacle in any direction
      for (const [dr, dc] of directions) {
        const midR = r + dr;
        const midC = c + dc;
        const nr = r + 2 * dr;
        const nc = c + 2 * dc;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

        // Must be jumping OVER an obstacle
        if (grid[midR]?.[midC] === 1 && grid[nr][nc] === 0) {
          const nextSteps = steps + 1; // teleport cost
          if (nextSteps < dist[nr][nc][1]) {
            dist[nr][nc][1] = nextSteps;
            pq.push([nextSteps, nr, nc, 1]);
          }
        }
      }
    }
  }

  return -1;
}
