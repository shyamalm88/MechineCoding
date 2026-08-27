// ============================================================================
// APPROACH: DFS + Multi-Source BFS
// ============================================================================
/**
 * INTUITION:
 * This is a two-step problem. First, we need to find one of the islands to
 * start our search from. Then, we need to find the shortest path from that
 * island to the other one.
 *
 * 1. Find Island 1 (DFS): We can iterate through the grid until we find a '1'.
 *    Once found, we use DFS to explore the entire island, marking its cells
 *    (e.g., changing '1' to '2') and adding all its cells to a queue.
 *
 * 2. Find Shortest Path (BFS): Now, the queue contains all the cells of the
 *    first island. This is a "multi-source" BFS. We expand outwards from all
 *    these cells simultaneously, layer by layer. Each layer represents one
 *    flipped '0'. The first time we encounter a '1' (the second island),
 *    the current layer count is our shortest bridge length.
 *
 * Time Complexity: O(N^2) - We visit every cell at most a constant number of times.
 * Space Complexity: O(N^2) - For the queue and recursion stack in the worst case.
 */
const shortestBridge = (grid) => {
  const n = grid.length;
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const queue = [];
  let found = false;

  // Step 1a: DFS to find and mark the first island
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= n || c >= n || grid[r][c] !== 1) {
      return;
    }
    grid[r][c] = 2; // Mark as visited (2 indicates Island 1)
    queue.push([r, c]); // Add to the BFS queue

    for (let [dr, dc] of dirs) {
      let nr = dr + r;
      let nc = dc + c;
      dfs(nr, nc);
    }
  };

  // Step 1b: Find the first piece of land to start the DFS
  for (let i = 0; i < n && !found; i++) {
    for (let j = 0; j < n && !found; j++) {
      if (grid[i][j] === 1) {
        dfs(i, j);
        found = true;
      }
    }
  }

  // Step 2: Multi-source BFS expanding from Island 1
  let steps = 0;
  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();
      for (let [dr, dc] of dirs) {
        const nr = dr + r;
        const nc = dc + c;

        // Check boundaries and if already visited (2)
        if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] === 2)
          continue;

        // If we hit a '1', we found the second island!
        if (grid[nr][nc] === 1) return steps;

        grid[nr][nc] = 2; // Mark water as visited (part of the expanding bridge)
        queue.push([nr, nc]);
      }
    }
    steps++;
  }
  return -1;
};

// ============================================================================
// TEST CASES
// ============================================================================
const clone2D = (arr) => arr.map((row) => [...row]);

console.log("=== Shortest Bridge Tests ===\n");

console.log(
  "Test 1:",
  shortestBridge(
    clone2D([
      [0, 1],
      [1, 0],
    ]),
  ),
); // Expected: 1

console.log(
  "Test 2:",
  shortestBridge(
    clone2D([
      [0, 1, 0],
      [0, 0, 0],
      [0, 0, 1],
    ]),
  ),
); // Expected: 2

console.log(
  "Test 3:",
  shortestBridge(
    clone2D([
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ]),
  ),
); // Expected: 1
