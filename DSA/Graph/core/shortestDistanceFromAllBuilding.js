/**
 * ============================================================================
 * PROBLEM: Shortest Distance from All Buildings (LeetCode #317)
 * CATEGORY: 🔵 CORE (Multi-Source Shortest Path / BFS vs Dijkstra Decision)
 * ============================================================================
 *
 * You are given an m x n grid where:
 * - 0 = empty land
 * - 1 = building
 * - 2 = obstacle
 *
 * You want to build a house on an empty land such that the SUM of distances
 * from this land to ALL buildings is minimized.
 *
 * You can move:
 * - up, down, left, right
 * - each move costs 1 distance unit
 *
 * Return the minimum total distance.
 * If it is not possible to reach all buildings, return -1.
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   Input:
 *   [
 *     [1, 0, 2, 0, 1],
 *     [0, 0, 0, 0, 0],
 *     [0, 0, 1, 0, 0]
 *   ]
 *
 *   Buildings at (0,0), (0,4), (2,2)
 *
 *   Best empty land = (1,2)
 *
 *   Distances:
 *     (1,2) → (0,0) = 3
 *     (1,2) → (0,4) = 3
 *     (1,2) → (2,2) = 1
 *
 *   Total = 7
 *
 *   Output: 7
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - m, n <= 50
 * - grid[i][j] ∈ {0, 1, 2}
 * - At least one building
 *
 * ============================================================================
 * INTUITION: Sum of Distances to Multiple Sources
 * ============================================================================
 *
 * This is NOT a single-source shortest path problem.
 *
 * Instead, think:
 * - For EACH building:
 *     → compute distance to every reachable empty cell
 * - Then:
 *     → for each empty cell, sum distances from ALL buildings
 *
 * The answer is:
 *   min over all empty cells (sum of distances from all buildings)
 *
 * Key Insight (VERY IMPORTANT):
 * - All edges have weight = 1
 * - So we should use BFS, NOT Dijkstra
 *
 * Using Dijkstra here would be correct but inefficient and unnecessary.
 *
 * ============================================================================
 * WHY MULTI-SOURCE BFS IS THE RIGHT MODEL
 * ============================================================================
 *
 * We are effectively doing:
 *   B separate BFS traversals (one from each building)
 *
 * During BFS:
 * - We track distance to empty lands
 * - Accumulate total distances
 * - Count how many buildings can reach each empty cell
 *
 * Only cells reachable from ALL buildings are valid candidates.
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * Let:
 * - totalDist[r][c] = sum of distances from all buildings
 * - reachCount[r][c] = number of buildings that can reach this cell
 *
 * Steps:
 *
 * 1. Initialize totalDist and reachCount to 0
 * 2. Count total number of buildings = B
 * 3. For each building:
 *      a. BFS from building
 *      b. Track visited cells for this BFS
 *      c. For each empty cell reached:
 *           - totalDist += distance
 *           - reachCount += 1
 * 4. After all BFS runs:
 *      - For each empty cell:
 *           if reachCount == B:
 *              consider totalDist
 * 5. Return minimum totalDist, or -1 if none valid
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - B = number of buildings
 * - R = rows, C = cols
 *
 * Time:
 *   O(B × R × C)
 *
 * Space:
 *   O(R × C)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔵 CORE
 * ============================================================================
 *
 * Interviewers test:
 * - Can you recognize BFS instead of Dijkstra?
 * - Can you reason about multi-source shortest paths?
 * - Can you aggregate distances correctly?
 *
 * Many candidates FAIL by:
 * - Running Dijkstra from every empty cell ❌
 * - Forgetting to check reachability from all buildings ❌
 *
 * Getting this right shows strong fundamentals.
 * ============================================================================
 */

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
