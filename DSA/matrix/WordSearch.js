/**
 * Word Search (LeetCode 79)
 *
 * INTUITION:
 * Given a 2D grid of characters, find if a word exists by connecting
 * adjacent cells (horizontally or vertically). Each cell can only be used once.
 *
 * This is a classic BACKTRACKING problem - we explore paths and "undo" when stuck.
 *
 * KEY INSIGHT - DFS + Backtracking:
 *   Think of it like a maze where each step must match the next letter:
 *   1. Start from any cell matching the first letter
 *   2. Explore all 4 directions, looking for the next letter
 *   3. Mark visited cells to avoid revisiting in current path
 *   4. BACKTRACK: restore the cell when returning (crucial!)
 *
 * WHY BACKTRACKING?
 *   The same cell might be part of DIFFERENT valid paths.
 *   If we permanently mark cells, we block other potential solutions.
 *
 *   Example: Finding "AB" in:
 *     [A, B]
 *     [A, B]
 *   Path 1: (0,0)→(0,1) uses top-A
 *   Path 2: (1,0)→(1,1) uses bottom-A
 *   Without backtracking, marking top-A would block finding path from bottom-A
 *
 * VISUALIZATION:
 *   Board:        Looking for "ABCCED"
 *   [A, B, C, E]     A → B → C
 *   [S, F, C, S]           ↓
 *   [A, D, E, E]     D ← C ← (backtrack and explore)
 *
 * TIME: O(m * n * 4^L) - for each cell, explore 4 directions up to L (word length) times
 * SPACE: O(L) - recursion stack depth equals word length
 *
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
  const rows = board.length;
  const cols = board[0].length;

  // The Recursive "Search Party"
  const dfs = (r, c, i) => {
    // 1. Base Case: WIN
    // We have matched all characters in the word
    if (i === word.length) return true;

    // 2. Base Case: FAIL
    // Out of bounds OR letter doesn't match
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[i]) {
      return false;
    }

    // 3. The Choice (Marking path)
    // Save the current letter so we can restore it later
    const temp = board[r][c];
    board[r][c] = "#"; // Mark as visited so we don't go back in circles

    // 4. Explore Neighbors (OR logic)
    // If ANY path returns true, bubble it up
    const found =
      dfs(r + 1, c, i + 1) || // Down
      dfs(r - 1, c, i + 1) || // Up
      dfs(r, c + 1, i + 1) || // Right
      dfs(r, c - 1, i + 1); // Left

    // 5. Backtrack (The "Undo" Button)
    // CRITICAL: Restore the letter before returning!
    // This allows other paths to use this cell later.
    board[r][c] = temp;

    return found;
  };

  // Main Loop: Find potential start points
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Optimization: Only start DFS if the first letter matches
      if (board[r][c] === word[0] && dfs(r, c, 0)) {
        return true;
      }
    }
  }

  return false;
};
