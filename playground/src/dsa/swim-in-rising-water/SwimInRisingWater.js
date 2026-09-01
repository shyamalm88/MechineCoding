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
 * @param {number[][]} grid n x n elevations
 * @return {number} earliest time you can reach the bottom-right cell, which is
 *   the smallest possible MAXIMUM elevation along some path
 */
function swimInWater(grid) {
  const size = grid.length;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // bestElevation[row][col] = lowest "highest cell" needed to get there.
  const bestElevation = Array.from({ length: size }, () => Array(size).fill(Infinity));

  // Entries are [elevationSoFar, row, col], lowest first.
  const priorityQueue = new PriorityQueue((a, b) => a[0] < b[0]);

  bestElevation[0][0] = grid[0][0];
  priorityQueue.push([grid[0][0], 0, 0]);

  while (priorityQueue.size() > 0) {
    const [elevationSoFar, row, col] = priorityQueue.pop();

    // Lowest-first order means the first arrival is already optimal.
    if (row === size - 1 && col === size - 1) return elevationSoFar;

    // A lower route to this cell was queued later; this entry is stale.
    if (elevationSoFar > bestElevation[row][col]) continue;

    for (const [rowDelta, colDelta] of directions) {
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;

      if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) continue;

      // You wait for the water to cover the highest cell on the route, so the
      // path cost is a max() of elevations rather than a sum of steps.
      const nextElevation = Math.max(elevationSoFar, grid[nextRow][nextCol]);

      if (nextElevation < bestElevation[nextRow][nextCol]) {
        bestElevation[nextRow][nextCol] = nextElevation;
        priorityQueue.push([nextElevation, nextRow, nextCol]);
      }
    }
  }

  return -1; // unreachable: the grid is fully connected, so this never fires
}

// ============================================================================
// TEST CASES
// ============================================================================
// LeetCode defines PriorityQueue; Node does not. Uncomment the reference
// class near the top to run these locally.
if (typeof PriorityQueue === "undefined") {
  console.log("PriorityQueue is not defined - uncomment the reference class above to run these tests.");
} else {
  console.log("=== Swim in Rising Water Tests ===\n");

  console.log("Test 1:", swimInWater([[0, 2], [1, 3]])); // Expected: 3
  console.log("Test 2:", swimInWater([
    [0, 1, 2, 3, 4],
    [24, 23, 22, 21, 5],
    [12, 13, 14, 15, 16],
    [11, 17, 18, 19, 20],
    [10, 9, 8, 7, 6],
  ])); // Expected: 16
  console.log("Test 3:", swimInWater([[0]]));                       // Expected: 0 (single cell)
  console.log("Test 4:", swimInWater([[0, 1], [2, 3]]));            // Expected: 3
  console.log("Test 5:", swimInWater([[3, 2], [1, 0]]));            // Expected: 3 (start is the peak)
}

module.exports = { swimInWater };
