/**
 * ============================================================================
 * PROBLEM: Flood Fill (LeetCode #733)
 * ============================================================================
 * An image is represented by an m x n integer grid where image[i][j]
 * represents the pixel value of the image. Given a starting pixel (sr, sc)
 * and a new color, flood fill the image.
 *
 * Flood fill = change the color of the starting pixel AND all connected
 * pixels of the same color (4-directionally: up, down, left, right).
 *
 * Example 1:
 * Input:  image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
 * Output: [[2,2,2],[2,2,0],[2,0,1]]
 *
 * Visual:
 *   Before:           After:
 *   [1, 1, 1]         [2, 2, 2]
 *   [1, 1, 0]    →    [2, 2, 0]
 *   [1, 0, 1]         [2, 0, 1]
 *
 *   Starting at (1,1), all connected 1s become 2s.
 *   The bottom-right 1 is NOT connected (blocked by 0s).
 *
 * Example 2:
 * Input:  image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0
 * Output: [[0,0,0],[0,0,0]] (no change - same color)
 *
 * Constraints:
 * - m == image.length
 * - n == image[i].length
 * - 1 <= m, n <= 50
 * - 0 <= image[i][j], color < 2^16
 * - 0 <= sr < m, 0 <= sc < n
 */

// ============================================================================
// APPROACH: DFS (Depth-First Search)
// ============================================================================
/**
 * INTUITION:
 * This is a classic graph traversal problem. From the starting pixel,
 * explore all 4 directions recursively, changing color as we go.
 *
 * Key insight: Once we change a pixel's color, it no longer matches
 * originalColor, so we won't revisit it (acts as "visited" marker).
 *
 * Edge case: If originalColor === newColor, return early to avoid
 * infinite recursion (pixel would always match originalColor).
 *
 * Visual of DFS traversal:
 *   Start at (1,1):
 *   [1, 1, 1]     Step 1: Change (1,1) to 2
 *   [1, X, 0]     Step 2: DFS to (0,1), (2,1), (1,0), (1,2)
 *   [1, 0, 1]     Step 3: Continue recursively...
 *
 * Time Complexity: O(m × n) - visit each pixel at most once
 * Space Complexity: O(m × n) - recursion stack in worst case (all same color)
 */
const floodFill = (image, sr, sc, color) => {
  // Edge case: empty image
  if (!image || !image.length) return image;

  const row = image.length;
  const col = image[0].length;

  // Store the original color we need to replace
  const originalColor = image[sr][sc];

  // CRITICAL: If same color, return early to prevent infinite recursion
  // (changing pixel wouldn't change its value, so it would always match)
  if (originalColor === color) return image;

  // DFS helper function
  const dfs = (r, c) => {
    // Boundary check: out of bounds
    // Color check: not the original color (either already changed or different)
    if (
      r < 0 ||
      c < 0 ||
      r >= row ||
      c >= col ||
      image[r][c] !== originalColor
    ) {
      return;
    }

    // Change current pixel's color (also marks as visited)
    image[r][c] = color;

    // Explore all 4 directions (up, down, right, left)
    dfs(r + 1, c); // down
    dfs(r - 1, c); // up
    dfs(r, c + 1); // right
    dfs(r, c - 1); // left
  };

  // Start DFS from the given pixel
  dfs(sr, sc);
  return image;
};

// ============================================================================
// TEST CASES
// ============================================================================
const clone2D = (arr) => arr.map((row) => [...row]);

console.log("=== Flood Fill Tests ===\n");

// Test 1: Standard case
const img1 = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
];
console.log("Test 1:", JSON.stringify(floodFill(clone2D(img1), 1, 1, 2)));
// Expected: [[2,2,2],[2,2,0],[2,0,1]]

// Test 2: Same color (no change)
const img2 = [
  [0, 0, 0],
  [0, 0, 0],
];
console.log("Test 2:", JSON.stringify(floodFill(clone2D(img2), 0, 0, 0)));
// Expected: [[0,0,0],[0,0,0]]

// Test 3: Single pixel
const img3 = [[1]];
console.log("Test 3:", JSON.stringify(floodFill(clone2D(img3), 0, 0, 5)));
// Expected: [[5]]

// Test 4: Disconnected regions
const img4 = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 0, 1],
];
console.log("Test 4:", JSON.stringify(floodFill(clone2D(img4), 1, 1, 9)));
// Expected: [[1,0,1],[0,9,0],[1,0,1]] (only center changes)

module.exports = { floodFill };
