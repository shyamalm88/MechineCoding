/**
 * @param {number[][]} grid
 * @return {number}
 */
const orangesRotting = (grid) => {
  if (!grid || !grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Step 1: Find all rotten oranges and count fresh ones
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 2) {
        queue.push([i, j]); // All rotten oranges start spreading simultaneously
      } else if (grid[i][j] === 1) {
        freshCount++;
      }
    }
  }

  // Edge case: No fresh oranges to rot
  if (freshCount === 0) return 0;

  let minutes = 0;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // Right, Down, Left, Up

  // Step 2: BFS - Process wave by wave
  while (freshCount > 0 && queue.length > 0) {
    // process one BFS level = one minute
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        // 1️⃣ Boundary check (FIXED, UNIVERSAL)
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

        // 2️⃣ Problem-specific condition (Rotting Oranges logic)
        if (grid[nr][nc] === 1) {
          grid[nr][nc] = 2; // rot it
          freshCount--; // reduce fresh count
          queue.push([nr, nc]); // enqueue for next minute
        }
      }
    }

    minutes++; // one BFS layer completed
  }

  // Step 3: Check if any fresh oranges remain (isolated)
  return freshCount === 0 ? minutes : -1;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Standard case
console.log(
  "Test 1:",
  orangesRotting([
    [2, 1, 1],
    [1, 1, 0],
    [0, 1, 1],
  ]),
);
// Expected: 4

// Test 2: Isolated orange (impossible)
console.log(
  "Test 2:",
  orangesRotting([
    [2, 1, 1],
    [0, 1, 1],
    [1, 0, 1],
  ]),
);
// Expected: -1

// Test 3: No fresh oranges
console.log("Test 3:", orangesRotting([[0, 2]]));
// Expected: 0

// Test 4: All fresh, no rotten (impossible)
console.log(
  "Test 4:",
  orangesRotting([
    [1, 1, 1],
    [1, 1, 1],
  ]),
);
// Expected: -1

// Test 5: Already all rotten
console.log(
  "Test 5:",
  orangesRotting([
    [2, 2, 2],
    [2, 2, 2],
  ]),
);
// Expected: 0

// Test 6: Single fresh next to rotten
console.log("Test 6:", orangesRotting([[2, 1]]));
// Expected: 1
