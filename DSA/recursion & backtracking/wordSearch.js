/**
 * ============================================================================
 * PROBLEM: Word Search (LeetCode #79)
 * ============================================================================
 * Given an m x n grid of characters board and a string word, return true if
 * word exists in the grid.
 *
 * The word can be constructed from letters of sequentially adjacent cells,
 * where adjacent cells are horizontally or vertically neighboring. The same
 * letter cell may not be used more than once.
 *
 * Example 1:
 * Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
 * Output: true
 *
 * Example 2:
 * Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
 * Output: true
 *
 * Constraints:
 * - m == board.length, n = board[i].length
 * - 1 <= m, n <= 6
 * - 1 <= word.length <= 15
 */

// ============================================================================
// APPROACH: DFS + Backtracking
// ============================================================================
/**
 * INTUITION:
 * We iterate through every cell. If a cell matches the first letter of the word,
 * we start a DFS.
 * Inside DFS:
 * 1. Check boundaries and character match.
 * 2. Mark current cell as visited (e.g., replace with '#').
 * 3. Explore all 4 directions for the next character.
 * 4. Backtrack: Restore the original character so other paths can use it.
 *
 * Time Complexity: O(N * M * 4^L) where L is word length.
 * Space Complexity: O(L) - Recursion stack depth.
 */
const exist = (board, word) => {
  const rows = board.length;
  const cols = board[0].length;

  const dfs = (r, c, index) => {
    // Base Case: Found all characters
    if (index === word.length) return true;

    // Boundary & Match Check
    if (
      r < 0 ||
      c < 0 ||
      r >= rows ||
      c >= cols ||
      board[r][c] !== word[index]
    ) {
      return false;
    }

    // Mark as visited
    const temp = board[r][c];
    board[r][c] = "#";

    // Explore neighbors
    const found =
      dfs(r + 1, c, index + 1) ||
      dfs(r - 1, c, index + 1) ||
      dfs(r, c + 1, index + 1) ||
      dfs(r, c - 1, index + 1);

    // Backtrack (Restore)
    board[r][c] = temp;

    return found;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Word Search Tests ===\n");

const board1 = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
console.log("Test 1:", exist(board1, "ABCCED")); // Expected: true
console.log("Test 2:", exist(board1, "SEE")); // Expected: true
console.log("Test 3:", exist(board1, "ABCB")); // Expected: false

module.exports = { exist };
