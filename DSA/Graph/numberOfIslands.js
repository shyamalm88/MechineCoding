/**
 * @param {character[][]} grid
 * @return {number}
 */
const numIslands = (grid) => {
  // 1. Edge Case: Always handle empty inputs first
  if (!grid || !grid.length) return 0;

  let count = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  /**
   * Helper: Depth First Search to "Sink" the island
   * Logic: Turn '1' (Land) into '0' (Water) so we don't count it again.
   */
  const dfs = (r, c) => {
    // 🛑 BOUNDARY CHECKS:
    // 1. Out of bounds (negative or exceeding length)
    // 2. Already Water ('0') - Stop recursion
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === "0") {
      return;
    }

    // 🌊 SINK IT:
    // Mark as visited by mutating the grid directly.
    // This saves O(M*N) space compared to a 'visited' set.
    grid[r][c] = "0";

    // 🔄 RECURSE:
    // Visit all 4 neighbors (Up, Down, Left, Right)
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };

  // 2. Main Scan: Traverse the entire grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // 🏝️ FOUND LAND:
      // If we see a '1', it MUST be a new island because previous
      // calls would have sunk any connected land.
      if (grid[i][j] === "1") {
        count++;
        dfs(i, j); // Trigger the sink!
      }
    }
  }

  return count;
};
