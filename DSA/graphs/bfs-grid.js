/**
 * BFS ON GRID - SHORTEST PATH IN BINARY MATRIX
 *
 * Problem:
 * Given an n×n binary matrix `grid` where 0 = walkable, 1 = blocked,
 * find the shortest path from top-left (0,0) to bottom-right (n-1, n-1).
 * You can move in 8 directions (horizontal, vertical, diagonal).
 * Return the length of shortest path. If no path exists, return -1.
 *
 * Example:
 * Input: grid = [
 *   [0, 0, 0],
 *   [1, 1, 0],
 *   [0, 0, 0]
 * ]
 * Output: 5
 * Path: (0,0) → (0,1) → (0,2) → (1,2) → (2,2)
 *
 * Constraints:
 * - n == grid.length == grid[i].length
 * - 1 <= n <= 100
 * - grid[i][j] is 0 or 1
 * - Start and end cells must be 0 (walkable)
 */

// ==================== OPTIMAL: BFS ====================
/**
 * BFS guarantees shortest path in unweighted graphs/grids
 * Time: O(n²) - visit each cell at most once
 * Space: O(n²) - queue + visited set
 *
 * Key insight:
 * - BFS explores level-by-level (distance 1, 2, 3, ...)
 * - First time we reach destination = shortest path
 * - Use queue to track frontier cells
 * - Use visited set to avoid revisiting cells
 */
function shortestPathBinaryMatrix(grid) {
  const n = grid.length

  // Edge case: start or end blocked
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) {
    return -1
  }

  // Edge case: single cell
  if (n === 1) {
    return 1
  }

  // 8 directions: right, left, down, up, and 4 diagonals
  const directions = [
    [0, 1],   // right
    [0, -1],  // left
    [1, 0],   // down
    [-1, 0],  // up
    [1, 1],   // down-right
    [1, -1],  // down-left
    [-1, 1],  // up-right
    [-1, -1]  // up-left
  ]

  // BFS queue: [row, col, distance]
  const queue = [[0, 0, 1]] // Start at (0,0) with distance 1

  // Visited set: track visited cells to avoid cycles
  const visited = new Set()
  visited.add('0,0')

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift() // Dequeue (FIFO)

    // Check if reached destination
    if (row === n - 1 && col === n - 1) {
      return dist
    }

    // Explore all 8 neighbors
    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      const key = `${newRow},${newCol}`

      // Skip if out of bounds
      if (newRow < 0 || newRow >= n || newCol < 0 || newCol >= n) {
        continue
      }

      // Skip if blocked (1) or already visited
      if (grid[newRow][newCol] === 1 || visited.has(key)) {
        continue
      }

      // Mark as visited and enqueue
      visited.add(key)
      queue.push([newRow, newCol, dist + 1])
    }
  }

  // No path found
  return -1
}

// ==================== DRY RUN ====================
/**
 * Example: grid = [[0,0,0], [1,1,0], [0,0,0]]
 *
 * Initial: queue = [(0,0,1)], visited = {(0,0)}
 *
 * Step 1: Process (0,0,1)
 *   - Neighbors: (0,1), (1,0), (1,1) — only (0,1) is walkable & unvisited
 *   - queue = [(0,1,2)], visited = {(0,0), (0,1)}
 *
 * Step 2: Process (0,1,2)
 *   - Neighbors: (0,0)[visited], (0,2), (1,1)[blocked], (1,2), (1,0)[blocked]
 *   - Add (0,2) and (1,2)
 *   - queue = [(0,2,3), (1,2,3)], visited = {(0,0), (0,1), (0,2), (1,2)}
 *
 * Step 3: Process (0,2,3)
 *   - Neighbors include (1,2) [already visited]
 *   - No new cells
 *
 * Step 4: Process (1,2,3)
 *   - Neighbors include (2,2) — destination!
 *   - Add (2,2)
 *   - queue = [(2,2,4)], ...
 *
 * Step 5: Process (2,2,4)
 *   - row=2, col=2 → reached destination!
 *   - Return distance = 4
 *
 * Wait, the path is actually: (0,0)→(0,1)→(0,2)→(1,2)→(2,2) = 5 cells, not 4
 * (Distance = number of cells in path, including start)
 */

// ==================== TEST HARNESS ====================
function assertEq(actual, expected, label = '') {
  const ok = actual === expected
  console.log((ok ? '✅' : '❌'), label, 'got:', actual, 'expected:', expected)
}

console.log('=== BFS Grid - Shortest Path Tests ===\n')

// Test 1: Basic example
const grid1 = [
  [0, 0, 0],
  [1, 1, 0],
  [0, 0, 0]
]
assertEq(shortestPathBinaryMatrix(grid1), 5, 'Basic path with obstacles')

// Test 2: No path (blocked)
const grid2 = [
  [0, 1],
  [1, 0]
]
assertEq(shortestPathBinaryMatrix(grid2), -1, 'No path exists')

// Test 3: Single cell
const grid3 = [[0]]
assertEq(shortestPathBinaryMatrix(grid3), 1, 'Single cell')

// Test 4: Start blocked
const grid4 = [
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]
assertEq(shortestPathBinaryMatrix(grid4), -1, 'Start blocked')

// Test 5: End blocked
const grid5 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 1]
]
assertEq(shortestPathBinaryMatrix(grid5), -1, 'End blocked')

// Test 6: Straight diagonal path
const grid6 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]
assertEq(shortestPathBinaryMatrix(grid6), 3, 'Diagonal shortcut')

// Test 7: All blocked except edges
const grid7 = [
  [0, 1, 1, 0],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [0, 1, 1, 0]
]
assertEq(shortestPathBinaryMatrix(grid7), -1, 'Islands unreachable')

console.log('\n=== Edge Cases ===')

// Large grid (performance test)
const largeGrid = Array(50).fill(null).map(() => Array(50).fill(0))
console.log('Large 50×50 grid (all walkable):', shortestPathBinaryMatrix(largeGrid), '(expected ~50)')

console.log('\n=== Complexity Analysis ===')
console.log('Time:  O(n²) — visit each cell at most once')
console.log('Space: O(n²) — queue + visited set')
console.log('\nWhy BFS (not DFS)?')
console.log('- BFS explores level-by-level → guarantees shortest path')
console.log('- DFS may find A path, but not necessarily the shortest')
console.log('\nGotchas:')
console.log('- Must mark visited BEFORE adding to queue (avoid duplicates in queue)')
console.log('- Distance = path length (number of cells), not edges')
console.log('- 8 directions (not just 4) — allows diagonal movement')
console.log('- Check bounds before checking grid value (avoid index errors)')
