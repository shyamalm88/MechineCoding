/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function (grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;

  // Queue for BFS. We store coordinates [row, col]
  const queue = [];
  let freshCount = 0;

  // STEP 1: Initialization Scan
  // We must find all infection sources (Rotten Oranges) and count Fresh ones.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]); // Add rotten orange to queue
      } else if (grid[r][c] === 1) {
        freshCount++; // Count fresh oranges
      }
    }
  }

  // EDGE CASE: If there are no fresh oranges to begin with, time is 0.
  if (freshCount === 0) return 0;

  let minutes = 0;

  // Directions array: Up, Down, Left, Right
  // This makes the inner loop cleaner than writing 4 'if' statements.
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // STEP 2: The BFS Loop (The "Wave")
  while (queue.length > 0 && freshCount > 0) {
    // CRITICAL: We snapshot the queue length.
    // This ensures we only process the oranges that were rotten AT THE START of this minute.
    // Any orange infected during this loop will be processed in the NEXT minute.
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const [currRow, currCol] = queue.shift();

      // Check all 4 neighbors
      for (const [dRow, dCol] of directions) {
        const newRow = currRow + dRow;
        const newCol = currCol + dCol;

        // Boundary Checks: Is it inside the grid?
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          grid[newRow][newCol] === 1 // Is it a fresh orange?
        ) {
          // INFECT IT!
          grid[newRow][newCol] = 2; // Mark as rotten so we don't visit it again
          freshCount--; // Decrement fresh count
          queue.push([newRow, newCol]); // Add to queue for NEXT minute
        }
      }
    }

    // After processing the whole "wave" (current queue size), increment time
    minutes++;
  }

  // STEP 3: Final Verification
  // If we still have fresh oranges left, it means they are unreachable (isolated).
  // Return -1. Otherwise, return the minutes elapsed.
  return freshCount === 0 ? minutes : -1;
};

// --- TEST CASE FOR YOU TO RUN ---
const grid = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
];

console.log(orangesRotting(grid)); // Output should be 4
