/**
 * @param {number[][]} grid
 * @return {number}
 */
const orangesRotting = (grid) => {
  // 1. Edge Case: Always handle empty inputs
  if (!grid || !grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // 2. Initialization Phase: O(M * N)
  // We must find ALL rotten oranges to start the "wave" simultaneously.
  // We also count fresh oranges to know when we are done.
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 2) {
        queue.push([i, j]);
      } else if (grid[i][j] === 1) {
        freshCount++;
      }
    }
  }

  // Optimization: If there are no fresh oranges, no time passes.
  if (freshCount === 0) return 0;

  let minutes = 0;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // Right, Down, Left, Up

  // 3. BFS Wave Logic
  // Loop while there are still rotten oranges spreading AND fresh ones left
  while (freshCount > 0 && queue.length > 0) {
    // 🛑 CRITICAL STEP: Snapshot the current level size.
    // We only process the oranges that were ALREADY rotten at the start of this minute.
    // Newly rotten oranges are added to the queue but processed in the NEXT minute.
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();

      for (let [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        // Check Bounds AND if the neighbor is a Fresh Orange
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          grid[nr][nc] === 1
        ) {
          // Infect the orange!
          grid[nr][nc] = 2; // Mark as visited/rotten
          freshCount--; // Decrement count
          queue.push([nr, nc]); // Add to queue for next minute
        }
      }
    }
    // Increment time only after processing the entire "wave" (level)
    minutes++;
  }

  // 4. Final Check
  // If freshCount > 0, it means some oranges are isolated and unreachable.
  return freshCount === 0 ? minutes : -1;
};
