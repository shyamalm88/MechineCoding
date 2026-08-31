// ============================================================================
// APPROACH: DFS Flood Fill + a Canonical Path Signature
// ============================================================================
/**
 * STORY / INTUITION:
 * Number of Islands answers "how many"; this asks "how many SHAPES". The flood
 * fill is identical — the new work is describing a shape in a way that is
 * identical for two translated copies.
 *
 * Recording absolute coordinates fails immediately: the same square at (0,0) and
 * at (2,3) produces different lists. What IS translation-invariant is the PATH
 * the DFS walks. Start every island's walk at its first-discovered cell and
 * record the direction of each step — D, U, R, L. Two islands of the same shape,
 * explored in the same fixed neighbour order, generate the identical string.
 *
 * THE BUG EVERYONE HITS: recording only the moves is not enough. Without a
 * marker for RETURNING from a dead end, distinct shapes collide. Consider a
 * three-cell L and a three-cell line — both can emit "SDD"-like strings if the
 * backtracking is invisible. Push a 'B' when a call returns and the signature
 * becomes unambiguous, because it now encodes the tree structure of the walk,
 * not just the cells visited.
 *
 * DRY RUN: the 2x2 square at rows 0-1, cols 0-1
 *   start (0,0) 'S' → down (1,0) 'D' → its down is out of bounds, up is visited,
 *   right (1,1) 'R' → dead end, 'B' → back at (1,0), 'B' → back at (0,0),
 *   right (0,1) 'R' → down (1,1) already visited → 'B' → 'B'
 *   signature "SDRBBRBB" — and the square at rows 2-3, cols 3-4 produces exactly
 *   the same string, so the Set keeps one.
 *
 * Time:  O(M*N) — each cell visited once
 * Space: O(M*N) for the recursion stack and the signature set
 */
const numDistinctIslands = (grid) => {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const shapes = new Set();

  const dfs = (r, c, direction, path) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 1) return;

    grid[r][c] = 0; // sink it, so each cell is walked once
    path.push(direction);

    dfs(r + 1, c, "D", path);
    dfs(r - 1, c, "U", path);
    dfs(r, c + 1, "R", path);
    dfs(r, c - 1, "L", path);

    // Without this backtrack marker, different shapes can share a signature.
    path.push("B");
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        const path = [];
        dfs(r, c, "S", path); // every walk starts with the same token
        shapes.add(path.join(""));
      }
    }
  }

  return shapes.size;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Number of Distinct Islands Tests ===\n");

console.log("Test 1:", numDistinctIslands([
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
])); // Expected: 1

console.log("Test 2:", numDistinctIslands([
  [1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1],
])); // Expected: 3

console.log("Test 3:", numDistinctIslands([[0, 0], [0, 0]])); // Expected: 0
console.log("Test 4:", numDistinctIslands([[1, 1, 1]]));      // Expected: 1

console.log("Test 5:", numDistinctIslands([
  [1, 0, 1],
  [0, 0, 0],
  [1, 0, 1],
])); // Expected: 1 (four separate single cells, all the same shape)

module.exports = { numDistinctIslands };
