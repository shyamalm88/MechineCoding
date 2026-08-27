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
