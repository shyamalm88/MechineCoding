/**
 * ============================================================================
 * PROBLEM: Pacific Atlantic Water Flow (LeetCode #417)
 * ============================================================================
 *
 * There is an m x n rectangular island that borders both the Pacific Ocean
 * and the Atlantic Ocean. The Pacific Ocean touches the island's left and
 * top edges, and the Atlantic Ocean touches the island's right and bottom edges.
 *
 * The island is partitioned into a grid of square cells. You are given an
 * m x n integer matrix heights where heights[r][c] represents the height
 * above sea level of the cell at coordinate (r, c).
 *
 * The island receives a lot of rain, and the rain water can flow to
 * neighboring cells directly north, south, east, and west if the neighboring
 * cell's height is less than or equal to the current cell's height.
 * Water can flow from any cell adjacent to an ocean into the ocean.
 *
 * Return a 2D list of grid coordinates result where result[i] = [ri, ci]
 * denotes that rain water can flow from cell (ri, ci) to both the Pacific
 * and Atlantic oceans.
 *
 * Example 1:
 *
 *   Pacific Ocean (top & left)
 *        ~  ~  ~  ~  ~
 *     ~  1  2  2  3  5  *
 *     ~  3  2  3  4  4  *
 *     ~  2  4  5  3  1  *
 *     ~  6  7  1  4  5  *
 *     ~  5  1  1  2  4  *
 *        *  *  *  *  *
 *   Atlantic Ocean (bottom & right)
 *
 * Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
 * Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
 * Explanation: Cells where water can flow to both oceans are marked.
 *
 * Example 2:
 * Input: heights = [[1]]
 * Output: [[0,0]]
 * Explanation: Single cell can reach both oceans (it's on all edges).
 *
 * Constraints:
 * - m == heights.length
 * - n == heights[r].length
 * - 1 <= m, n <= 200
 * - 0 <= heights[r][c] <= 10^5
 *
 * ============================================================================
 * INTUITION: Reverse DFS from Ocean Edges
 * ============================================================================
 *
 * Naive Approach (TLE):
 * - From each cell, DFS to check if it can reach Pacific
 * - From each cell, DFS to check if it can reach Atlantic
 * - O(m*n) cells × O(m*n) DFS each = O((m*n)^2) - Too slow!
 *
 * Optimized Approach (Reverse Flow):
 * - Instead of "can water flow FROM this cell TO ocean?"
 * - Ask "can water flow TO this cell FROM ocean?" (reverse direction)
 * - Start DFS from ocean edges and go UPHILL (>= height)
 *
 * Why Reverse Works:
 * - Normal: water flows from HIGH to LOW (or equal)
 * - Reverse: we go from LOW to HIGH (or equal)
 * - If reverse path exists: ocean -> cell, then normal path exists: cell -> ocean
 *
 * Algorithm:
 * 1. Create two Sets: pacificReachable, atlanticReachable
 * 2. DFS from Pacific edges (top row + left column)
 * 3. DFS from Atlantic edges (bottom row + right column)
 * 4. Return cells that are in BOTH sets (intersection)
 *
 * Visual of DFS direction:
 *
 *   Pacific starts here
 *        ↓  ↓  ↓  ↓  ↓
 *     →  1  2  2  3  5
 *     →  3  2  3  4  4  ←  Atlantic starts here
 *     →  2  4  5  3  1  ←
 *     →  6  7  1  4  5  ←
 *     →  5  1  1  2  4  ←
 *        ↑  ↑  ↑  ↑  ↑
 *
 * Time Complexity: O(M * N) - each cell visited at most twice (once per ocean)
 * Space Complexity: O(M * N) - two Sets + recursion stack
 * ============================================================================
 */

/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
const pacificAtlantic = (heights) => {
  if (!heights || heights.length === 0) return [];

  const rows = heights.length;
  const cols = heights[0].length;

  // Track cells reachable from each ocean
  // Using string keys "r-c" because JS Sets compare objects by reference
  const pacificReachable = new Set();
  const atlanticReachable = new Set();

  /**
   * DFS: Go "uphill" from ocean to find all cells that can drain to it
   * @param {number} r - Current row
   * @param {number} c - Current column
   * @param {Set} reachable - Set tracking reachable cells for this ocean
   * @param {number} prevHeight - Height of cell we came from
   */
  const dfs = (r, c, reachable, prevHeight) => {
    const key = `${r}-${c}`;

    // Stop conditions:
    if (
      r < 0 ||
      r >= rows || // Out of bounds
      c < 0 ||
      c >= cols ||
      reachable.has(key) || // Already visited for this ocean
      heights[r][c] < prevHeight // Can't go "downhill" in reverse (would be uphill for water)
    ) {
      return;
    }

    // Mark as reachable from this ocean
    reachable.add(key);

    // Explore all 4 directions (looking for higher or equal cells)
    const currentHeight = heights[r][c];
    dfs(r + 1, c, reachable, currentHeight); // Down
    dfs(r - 1, c, reachable, currentHeight); // Up
    dfs(r, c + 1, reachable, currentHeight); // Right
    dfs(r, c - 1, reachable, currentHeight); // Left
  };

  // Start DFS from Pacific edges (top row & left column)
  // Start DFS from Atlantic edges (right column & bottom row)
  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pacificReachable, heights[r][0]); // Left edge -> Pacific
    dfs(r, cols - 1, atlanticReachable, heights[r][cols - 1]); // Right edge -> Atlantic
  }

  for (let c = 0; c < cols; c++) {
    dfs(0, c, pacificReachable, heights[0][c]); // Top edge -> Pacific
    dfs(rows - 1, c, atlanticReachable, heights[rows - 1][c]); // Bottom edge -> Atlantic
  }

  // Find intersection: cells reachable from BOTH oceans
  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r}-${c}`;
      if (pacificReachable.has(key) && atlanticReachable.has(key)) {
        result.push([r, c]);
      }
    }
  }

  return result;
};

// ============================================================================
// ALTERNATIVE: BFS Approach
// ============================================================================
const pacificAtlanticBFS = (heights) => {
  if (!heights || heights.length === 0) return [];

  const rows = heights.length;
  const cols = heights[0].length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const bfs = (starts) => {
    const reachable = new Set();
    const queue = [...starts];

    // Mark all starting cells
    for (let [r, c] of starts) {
      reachable.add(`${r}-${c}`);
    }

    while (queue.length > 0) {
      const [r, c] = queue.shift();

      for (let [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr}-${nc}`;

        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !reachable.has(key) &&
          heights[nr][nc] >= heights[r][c]
        ) {
          reachable.add(key);
          queue.push([nr, nc]);
        }
      }
    }

    return reachable;
  };

  // Pacific: top row + left column
  const pacificStarts = [];
  for (let r = 0; r < rows; r++) pacificStarts.push([r, 0]);
  for (let c = 1; c < cols; c++) pacificStarts.push([0, c]);

  // Atlantic: bottom row + right column
  const atlanticStarts = [];
  for (let r = 0; r < rows; r++) atlanticStarts.push([r, cols - 1]);
  for (let c = 0; c < cols - 1; c++) atlanticStarts.push([rows - 1, c]);

  const pacificReachable = bfs(pacificStarts);
  const atlanticReachable = bfs(atlanticStarts);

  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r}-${c}`;
      if (pacificReachable.has(key) && atlanticReachable.has(key)) {
        result.push([r, c]);
      }
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Standard example
console.log("Test 1:");
console.log(
  pacificAtlantic([
    [1, 2, 2, 3, 5],
    [3, 2, 3, 4, 4],
    [2, 4, 5, 3, 1],
    [6, 7, 1, 4, 5],
    [5, 1, 1, 2, 4],
  ])
);
// Expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]

// Test 2: Single cell
console.log("\nTest 2:");
console.log(pacificAtlantic([[1]]));
// Expected: [[0,0]]

// Test 3: All same height
console.log("\nTest 3:");
console.log(
  pacificAtlantic([
    [1, 1],
    [1, 1],
  ])
);
// Expected: [[0,0],[0,1],[1,0],[1,1]] (all cells can reach both)

// Test 4: Descending from top-left
console.log("\nTest 4:");
console.log(
  pacificAtlantic([
    [3, 2, 1],
    [2, 1, 0],
    [1, 0, 0],
  ])
);
// Expected: [[0,0]] (only top-left corner flows to both)

// Test 5: Empty input
console.log("\nTest 5:");
console.log(pacificAtlantic([]));
// Expected: []

// Test 6: Single row
console.log("\nTest 6:");
console.log(pacificAtlantic([[1, 2, 3, 4, 5]]));
// Expected: All cells (single row touches both oceans at edges)

// Test 7: Single column
console.log("\nTest 7:");
console.log(pacificAtlantic([[1], [2], [3], [4], [5]]));
// Expected: All cells (single column touches both oceans at edges)

// Test 8: BFS approach
console.log("\nTest 8 - BFS approach:");
console.log(
  pacificAtlanticBFS([
    [1, 2, 2, 3, 5],
    [3, 2, 3, 4, 4],
    [2, 4, 5, 3, 1],
    [6, 7, 1, 4, 5],
    [5, 1, 1, 2, 4],
  ])
);
// Expected: Same as Test 1
