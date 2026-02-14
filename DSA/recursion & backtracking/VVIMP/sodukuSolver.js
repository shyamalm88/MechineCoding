/**
 * ============================================================================
 * PROBLEM: Sudoku Solver (LeetCode #37)
 * CATEGORY: 🔴 VVIMP (Backtracking + Constraint Propagation)
 * ============================================================================
 *
 * Solve a 9x9 Sudoku board.
 *
 * Rules:
 * - Each row must contain digits 1–9
 * - Each column must contain digits 1–9
 * - Each 3x3 sub-box must contain digits 1–9
 *
 * Empty cells are represented by '.'
 *
 * Modify the board IN-PLACE.
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 *
 * Sudoku is NOT brute force.
 *
 * Key Insight (CRITICAL):
 *
 *   Every choice restricts future choices.
 *
 * So:
 * - We must check constraints BEFORE recursing
 * - Early pruning is everything
 *
 * ============================================================================
 * BACKTRACKING STATE
 * ============================================================================
 *
 * State:
 * - board
 * - current cell (row, col)
 *
 * Choice:
 * - Try digits '1' → '9' that are valid
 *
 * ============================================================================
 * VALIDITY CHECK
 * ============================================================================
 *
 * A digit is valid if:
 * - Not in same row
 * - Not in same column
 * - Not in same 3x3 box
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * 1. Find first empty cell
 * 2. Try digits 1–9
 * 3. If valid:
 *      - place digit
 *      - recurse
 *      - if success → return true
 * 4. If all fail:
 *      - reset cell
 *      - backtrack
 *
 * ============================================================================
 * TIME COMPLEXITY
 * ============================================================================
 *
 * Exponential, but heavily pruned.
 *
 * ============================================================================
 * WHY THIS IS 🔴 VVIMP
 * ============================================================================
 *
 * Interviewers are testing:
 * - Constraint reasoning
 * - Correct pruning
 * - Clean recursion
 *
 * This problem screams “strong problem solver”.
 * ============================================================================
 */

function solveSudoku(board) {
  function isValid(row, col, ch) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === ch) return false;
      if (board[i][col] === ch) return false;

      const r = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const c = 3 * Math.floor(col / 3) + (i % 3);
      if (board[r][c] === ch) return false;
    }
    return true;
  }

  function backtrack() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === ".") {
          for (let ch = "1"; ch <= "9"; ch++) {
            if (isValid(r, c, ch)) {
              board[r][c] = ch;
              if (backtrack()) return true;
              board[r][c] = "."; // undo
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  backtrack();
}
