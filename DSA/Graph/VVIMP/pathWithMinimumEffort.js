/**
 * ============================================================================
 * PROBLEM: Path With Minimum Effort (LeetCode #1631)
 * ============================================================================
 * You are a hiker preparing for an upcoming hike. You are given heights, a 2D
 * array of size rows x columns, where heights[row][col] represents the height
 * of cell (row, col). You are situated in the top-left cell, (0, 0), and you
 * hope to travel to the bottom-right cell, (rows-1, columns-1) (i.e.,
 * 0-indexed). You can move up, down, left, or right, and you wish to find a
 * route that requires the minimum effort.
 *
 * A route's effort is the maximum absolute difference in heights between two
 * consecutive cells of the route.
 *
 * Return the minimum effort required to travel from the top-left cell to the
 * bottom-right cell.
 *
 * Example 1:
 * Input: heights = [[1,2,2],[3,8,2],[5,3,5]]
 * Output: 2
 * Explanation: The route of [1,3,5,3,5] has a maximum absolute difference of 2
 * in consecutive cells. This is better than the route of [1,2,2,2,5], where
 * the maximum absolute difference is 3.
 *
 * Example 2:
 * Input: heights = [[1,2,3],[3,8,4],[5,3,5]]
 * Output: 1
 * Explanation: The route of [1,2,3,4,5] has a maximum absolute difference of 1
 * in consecutive cells, which is better than route [1,3,5,3,5].
 *
 * Constraints:
 * - rows == heights.length
 * - columns == heights[i].length
 * - 1 <= rows, columns <= 100
 * - 1 <= heights[i][j] <= 10^6
 */

// ============================================================================
// APPROACH: Binary Search on Answer + DFS/BFS
// ============================================================================
/**
 * INTUITION:
 * The problem asks for the "minimum maximum difference". This structure often
 * suggests "Binary Search on Answer".
 *
 * If we can reach the destination with max effort K, we can definitely reach
 * it with any effort > K. This monotonicity allows us to binary search.
 *
 * 1. Range for binary search: [0, 10^6] (max possible height difference).
 * 2. Check function `canReach(limit)`:
 *    - Can we go from (0,0) to (R-1, C-1) using only edges where
 *      abs(height[a] - height[b]) <= limit?
 *    - This is a simple connectivity problem solvable with DFS or BFS.
 *
 * Time Complexity: O(M * N * log(MaxHeight))
 * - Binary search runs log(10^6) times (approx 20 iterations).
 * - Each check takes O(M * N) for DFS/BFS traversal.
 *
 * Space Complexity: O(M * N)
 * - Visited array and recursion stack.
 */
const pathWithMinimumEffort = (grid) => {
  let left = 0;
  let right = 1000000; // Max possible height difference based on constraints
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

  // Helper: Check if path exists with max difference <= effort
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

        // Check if the move is within the effort limit
        if (Math.abs(grid[r][c] - grid[nr][nc]) <= effort) {
          if (dfs(nr, nc)) return true;
        }
      }
      return false;
    };

    return dfs(0, 0);
  }
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
  ])
);
// Expected: 2

// Test 2
console.log(
  "Test 2:",
  pathWithMinimumEffort([
    [1, 2, 3],
    [3, 8, 4],
    [5, 3, 5],
  ])
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
  ])
);
// Expected: 0

module.exports = { pathWithMinimumEffort };
