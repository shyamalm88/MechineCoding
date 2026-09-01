/**
 * ============================================================================
 * PROBLEM: Path With Minimum Effort (LeetCode #1631)
 * ============================================================================
 *
 * You are a hiker preparing for an upcoming hike. You are given `heights`, a 2D
 * array of size rows x columns, where heights[r][c] represents the height of
 * cell (r, c).
 *
 * You start at the top-left cell (0, 0) and want to reach the bottom-right cell
 * (rows-1, cols-1). From any cell, you may move:
 *   - up
 *   - down
 *   - left
 *   - right
 *
 * The effort of a route is defined as:
 *   - the MAXIMUM absolute difference in heights between two consecutive cells
 *     along the route.
 *
 * Your task is to find the minimum possible effort required to travel from
 * start to destination.
 *
 * ----------------------------------------------------------------------------
 * Example:
 * Input:
 *   heights = [[1,2,2],
 *              [3,8,2],
 *              [5,3,5]]
 * Output: 2
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * APPROACH: Dijkstra / Priority Queue (Minimize the Maximum Edge)
 * ============================================================================
 *
 * INTUITION:
 *
 * This is a shortest-path problem with a NON-STANDARD cost definition.
 *
 * - Moving between two adjacent cells has a "cost":
 *     |height[current] - height[next]|
 * - The total cost of a path is NOT the sum of costs,
 *   but the MAXIMUM cost encountered along the path.
 *
 * Key Observation:
 * - As we extend a path, the effort (max edge so far) NEVER decreases.
 * - This monotonic property allows Dijkstra’s algorithm to work.
 *
 * Instead of minimizing SUM of edges, we minimize:
 *
 *   max(edge_1, edge_2, ..., edge_k)
 *
 * ---------------------------------------------------------------------------
 * STATE:
 *
 * - Each cell (r, c) is a node
 * - lowestEffort[row][col] = minimum possible effort to reach (row, col)
 *
 * ---------------------------------------------------------------------------
 * EDGE RELAXATION:
 *
 * From (r, c) → (nr, nc):
 *
 *   edgeEffort = |heights[r][c] - heights[nr][nc]|
 *   worstStepSoFar = max(effortSoFar, stepEffort)
 *
 * If worstStepSoFar < lowestEffort[nextRow][nextCol], update it.
 *
 * ---------------------------------------------------------------------------
 * ALGORITHM:
 *
 * 1. Initialize lowestEffort[][] with Infinity
 * 2. lowestEffort[0][0] = 0
 * 3. Push (0, 0, 0) into min-heap → [effort, row, col]
 * 4. While heap is not empty:
 *    a. Pop cell with minimum effort so far
 *    b. If it is destination, return effort
 *    c. Relax all valid neighbors
 *
 * ---------------------------------------------------------------------------
 * TIME COMPLEXITY:
 *
 * - Each cell is processed at most once with its best effort
 * - Heap operations: O(log(R * C))
 *
 * Total: O(R * C * log(R * C))
 *
 * ---------------------------------------------------------------------------
 * SPACE COMPLEXITY:
 *
 * - dist array: O(R * C)
 * - priority queue: O(R * C)
 *
 * ============================================================================
 */

// ============================================================================
// SAMPLE PriorityQueue (reference only)
// ============================================================================
// LeetCode provides PriorityQueue for you, so the solution below just uses it.
// This is what it looks like, if you want to run the file locally with Node --
// uncomment this block and the tests at the bottom will execute.
//
// The comparator is a BOOLEAN "does a come before b", which is LeetCode's
// convention:  min-heap -> (a, b) => a[0] < b[0]
//              max-heap -> (a, b) => a[0] > b[0]
//
// class PriorityQueue {
//   constructor(comesFirst) {
//     this.heap = [];
//     this.comesFirst = comesFirst;
//   }
//
//   size() {
//     return this.heap.length;
//   }
//
//   push(entry) {
//     this.heap.push(entry);
//
//     // Bubble up while this entry outranks its parent.
//     let index = this.heap.length - 1;
//     while (index > 0) {
//       const parent = (index - 1) >> 1;
//       if (!this.comesFirst(this.heap[index], this.heap[parent])) break;
//       [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
//       index = parent;
//     }
//   }
//
//   pop() {
//     if (this.heap.length === 0) return undefined;
//
//     const top = this.heap[0];
//     const last = this.heap.pop();
//     if (this.heap.length === 0) return top;
//
//     // Move the last entry to the root and sink it back down.
//     this.heap[0] = last;
//     let index = 0;
//     for (;;) {
//       const left = 2 * index + 1;
//       const right = left + 1;
//       let best = index;
//       if (left < this.heap.length && this.comesFirst(this.heap[left], this.heap[best])) best = left;
//       if (right < this.heap.length && this.comesFirst(this.heap[right], this.heap[best])) best = right;
//       if (best === index) break;
//       [this.heap[best], this.heap[index]] = [this.heap[index], this.heap[best]];
//       index = best;
//     }
//
//     return top;
//   }
// }
// ============================================================================

/**
 * @param {number[][]} heights grid of cell elevations
 * @return {number} the smallest possible "worst single step" along some path
 *   from the top-left cell to the bottom-right one
 */
const pathWithMinimumEffort = (heights) => {
  const rowCount = heights.length;
  const colCount = heights[0].length;

  // lowestEffort[row][col] = best "worst step" seen for reaching that cell.
  const lowestEffort = Array.from({ length: rowCount }, () => Array(colCount).fill(Infinity));

  // Entries are [effortSoFar, row, col], smallest effort first.
  const priorityQueue = new PriorityQueue((a, b) => a[0] < b[0]);

  lowestEffort[0][0] = 0;
  priorityQueue.push([0, 0, 0]);

  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (priorityQueue.size() > 0) {
    const [effortSoFar, row, col] = priorityQueue.pop();

    // Smallest-first order means the first arrival is already optimal.
    if (row === rowCount - 1 && col === colCount - 1) return effortSoFar;

    // A gentler route to this cell was queued later; this entry is stale.
    if (effortSoFar > lowestEffort[row][col]) continue;

    for (const [rowDelta, colDelta] of directions) {
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;

      if (nextRow < 0 || nextCol < 0 || nextRow >= rowCount || nextCol >= colCount) continue;

      const stepEffort = Math.abs(heights[row][col] - heights[nextRow][nextCol]);

      // The cost of a path is its WORST step, not the sum of its steps -- so
      // costs combine with max(), not +. That single change is what turns
      // Dijkstra into a minimax-path search.
      const worstStepSoFar = Math.max(effortSoFar, stepEffort);

      if (worstStepSoFar < lowestEffort[nextRow][nextCol]) {
        lowestEffort[nextRow][nextCol] = worstStepSoFar;
        priorityQueue.push([worstStepSoFar, nextRow, nextCol]);
      }
    }
  }

  return 0; // a 1x1 grid never enters the loop body past the first pop
};

// ============================================================================
// TEST CASES
// ============================================================================
// LeetCode defines PriorityQueue; Node does not. Uncomment the reference
// class near the top to run these locally.
if (typeof PriorityQueue === "undefined") {
  console.log("PriorityQueue is not defined - uncomment the reference class above to run these tests.");
} else {
  console.log("=== Path With Minimum Effort Tests ===\n");

  console.log("Test 1:", pathWithMinimumEffort([[1, 2, 2], [3, 8, 2], [5, 3, 5]])); // Expected: 2
  console.log("Test 2:", pathWithMinimumEffort([[1, 2, 3], [3, 8, 4], [5, 3, 5]])); // Expected: 1
  console.log("Test 3:", pathWithMinimumEffort([
    [1, 2, 1, 1, 1],
    [1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1],
    [1, 1, 1, 2, 1],
  ])); // Expected: 0
  console.log("Test 4:", pathWithMinimumEffort([[1]]));            // Expected: 0 (single cell)
  console.log("Test 5:", pathWithMinimumEffort([[1, 10]]));        // Expected: 9 (forced single step)
}

module.exports = { pathWithMinimumEffort };
