/**
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
