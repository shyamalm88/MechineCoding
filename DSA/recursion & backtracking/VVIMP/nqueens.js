/**
 * ============================================================================
 * PROBLEM: N-Queens (LeetCode #51)
 * ============================================================================
 * The n-queens puzzle is the problem of placing n queens on an n x n chessboard
 * such that no two queens attack each other.
 *
 * Given an integer n, return all distinct solutions to the n-queens puzzle.
 * You may return the answer in any order.
 *
 * Each solution contains a distinct board configuration of the n-queens' placement,
 * where 'Q' and '.' both indicate a queen and an empty space, respectively.
 *
 * Example 1:
 * Input: n = 4
 * Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
 *
 * Example 2:
 * Input: n = 1
 * Output: [["Q"]]
 *
 * Constraints:
 * - 1 <= n <= 9
 */

// ============================================================================
// APPROACH: Backtracking
// ============================================================================
/**
 * INTUITION:
 * We need to place one queen per row.
 * For each row, we try placing a queen in every column (0 to n-1).
 * Before placing, we check if the position is under attack.
 *
 * A position (r, c) is under attack if:
 * 1. Another queen is in the same column `c`.
 * 2. Another queen is on the same positive diagonal (r + c = constant).
 * 3. Another queen is on the same negative diagonal (r - c = constant).
 *
 * We use Sets to keep track of occupied columns and diagonals for O(1) lookups.
 *
 * Time Complexity: O(N!) - The first queen has N choices, the second N-2 (approx), etc.
 * Space Complexity: O(N^2) - To store the board state (and O(N) for recursion/sets).
 */
const nQueen = (n) => {
  const cols = new Set();
  const negDiagonal = new Set();
  const posDiagonal = new Set();

  const res = [];

  // Initialize n x n board with '.'
  const board = Array.from({ length: n }, () => Array(n).fill("."));

  const backTrack = (row) => {
    // Base Case: If we've placed queens in all rows (0 to n-1), we found a solution
    if (row === n) {
      res.push(board.map((item) => item.join("")));
      return;
    }

    // Try placing queen in each column of the current row
    for (let col = 0; col < n; col++) {
      // Check if placing queen here is valid
      if (
        cols.has(col) ||
        negDiagonal.has(row - col) ||
        posDiagonal.has(row + col)
      )
        continue;

      // Choose (Place Queen)
      board[row][col] = "Q";
      cols.add(col);
      negDiagonal.add(row - col);
      posDiagonal.add(row + col);

      // Explore (Next Row)
      backTrack(row + 1);

      // Unchoose (Backtrack)
      board[row][col] = ".";
      cols.delete(col);
      negDiagonal.delete(row - col);
      posDiagonal.delete(row + col);
    }
  };

  backTrack(0);
  return res;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== N-Queens Tests ===\n");
console.log("Test 1 (n=4):", nQueen(4));
// Expected: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]

console.log("Test 2 (n=1):", nQueen(1));
// Expected: [["Q"]]

module.exports = { nQueen };
