/**
 * ============================================================================
 * PROBLEM: Surrounded Regions (LeetCode #130)
 * ============================================================================
 * Given an m x n matrix board containing 'X' and 'O', capture all regions
 * that are 4-directionally surrounded by 'X'.
 *
 * A region is captured by flipping all 'O's into 'X's in that surrounded region.
 *
 * Example 1:
 * Input: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
 * Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
 * Explanation: The 'O' in the bottom row is not surrounded because it's on the border.
 *
 * Constraints:
 * - m == board.length
 * - n == board[i].length
 * - 1 <= m, n <= 200
 * - board[i][j] is 'X' or 'O'.
 */

// ============================================================================
// APPROACH: DFS from Borders (Reverse Thinking)
// ============================================================================
/**
 * INTUITION:
 * Instead of finding surrounded 'O's, it's easier to find *unsurrounded* 'O's.
 * An 'O' is unsurrounded if it's on the border or connected to an 'O' on the border.
 *
 * 1. Start DFS/BFS from every 'O' on the four borders.
 * 2. Mark all reachable 'O's from the borders with a temporary marker (e.g., 'E' for Escaped).
 * 3. Iterate through the entire grid again:
 *    - If a cell is 'O' (it wasn't reached from a border), flip it to 'X'.
 *    - If a cell is 'E', flip it back to 'O'.
 *
 * Time Complexity: O(M * N)
 * Space Complexity: O(M * N) for the recursion stack in the worst case.
 */
const surroundedRegions = (board) => {
  if (!board || !board.length) return;

  const rows = board.length;
  const cols = board[0].length;

  const dfs = (r, c) => {
    // Boundary check or if not an 'O'
    if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== "O") {
      return;
    }
    // Mark as 'Escaped' (safe from being flipped)
    board[r][c] = "E";

    // Explore neighbors
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };

  // 1. Mark 'O's connected to the top and bottom borders
  for (let i = 0; i < rows; i++) {
    dfs(i, 0);
    dfs(i, cols - 1);
  }

  // 2. Mark 'O's connected to the left and right borders
  for (let j = 0; j < cols; j++) {
    dfs(0, j);
    dfs(rows - 1, j);
  }

  // 3. Iterate through the board to finalize states
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === "O") {
        // This 'O' was NOT reachable from the border, so it is surrounded. Flip to 'X'.
        board[i][j] = "X";
      }
      if (board[i][j] === "E") {
        // This was a safe 'O' (connected to border). Restore it to 'O'.
        board[i][j] = "O";
      }
    }
  }
};

// ============================================================================
// TEST CASES
// ============================================================================
const clone2D = (arr) => arr.map((row) => [...row]);

console.log("=== Surrounded Regions Tests ===\n");

const board1 = [
  ["X", "X", "X", "X"],
  ["X", "O", "O", "X"],
  ["X", "X", "O", "X"],
  ["X", "O", "X", "X"],
];
surroundedRegions(board1);
console.log("Test 1:", board1);
// Expected: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]

module.exports = { surroundedRegions };
