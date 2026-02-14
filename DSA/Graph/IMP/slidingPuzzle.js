/**
 * ============================================================================
 * PROBLEM: Sliding Puzzle (LeetCode #773)
 * CATEGORY: 🟢 IMPORTANT (BFS on Implicit State Graph)
 * ============================================================================
 *
 * You are given a 2x3 board representing a sliding puzzle.
 *
 * The board contains:
 * - Numbers 1 to 5
 * - One empty space represented by 0
 *
 * You can move the empty space (0) by swapping it with one of its
 * 4-directional neighbors.
 *
 * Return the MINIMUM number of moves required to reach the target board:
 *
 *   [[1,2,3],
 *    [4,5,0]]
 *
 * If it is impossible, return -1.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   board = [[1,2,3],[4,0,5]]
 *   Output: 1
 *
 * Example 2:
 *
 *   board = [[1,2,3],[5,4,0]]
 *   Output: -1
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - board is always 2x3
 *
 * ============================================================================
 * INTUITION: This Is a Shortest Path in STATE SPACE
 * ============================================================================
 *
 * This is NOT a grid traversal problem.
 *
 * Key Insight (VERY IMPORTANT):
 *
 *   Each BOARD CONFIGURATION is a NODE.
 *   A MOVE is an EDGE between configurations.
 *
 * The graph is:
 * - Implicit (not given)
 * - Unweighted (each move costs 1)
 *
 * We want:
 * - Minimum number of moves
 *
 * → BFS is the correct algorithm.
 *
 * ============================================================================
 * STATE REPRESENTATION (CRITICAL DESIGN CHOICE)
 * ============================================================================
 *
 * We need a way to:
 * - Store board states in a visited set
 * - Compare states efficiently
 *
 * Best representation:
 *   ➤ Convert board to a STRING
 *
 * Example:
 *   [[1,2,3],[4,0,5]] → "123405"
 *
 * This makes:
 * - Hashing easy
 * - Equality checks trivial
 *
 * ============================================================================
 * NEIGHBOR GENERATION (THE CORE LOGIC)
 * ============================================================================
 *
 * The puzzle is fixed-size (2x3), so:
 * - For each index of '0', we KNOW exactly which swaps are allowed
 *
 * Precompute adjacency:
 *
 * Index positions:
 *   [0, 1, 2,
 *    3, 4, 5]
 *
 * Valid swaps for index:
 *   0 → [1,3]
 *   1 → [0,2,4]
 *   2 → [1,5]
 *   3 → [0,4]
 *   4 → [1,3,5]
 *   5 → [2,4]
 *
 * ============================================================================
 * ALGORITHM (BFS)
 * ============================================================================
 *
 * 1. Serialize start board into string
 * 2. BFS queue:
 *      [stateString, steps]
 * 3. visited set to avoid revisiting states
 * 4. For each state:
 *      a. Find index of '0'
 *      b. Swap with all valid neighbors
 *      c. Enqueue unseen states
 *
 * 5. First time reaching target → return steps
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Total states = 6! = 720
 *
 * Time:
 *   O(720) ≈ O(1)
 *
 * Space:
 *   O(720)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🟢 IMPORTANT
 * ============================================================================
 *
 * Interviewers are testing:
 * - BFS on abstract state space
 * - Clean state encoding
 * - Neighbor generation correctness
 *
 * This is a CLASSIC Google problem.
 * ============================================================================
 */

function slidingPuzzle(board) {
  const start = board.flat().join("");
  const target = "123450";

  // Precomputed neighbors for each index of '0'
  const neighbors = {
    0: [1, 3],
    1: [0, 2, 4],
    2: [1, 5],
    3: [0, 4],
    4: [1, 3, 5],
    5: [2, 4],
  };

  const queue = [[start, 0]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [state, steps] = queue.shift();

    if (state === target) return steps;

    const zeroIdx = state.indexOf("0");

    for (const nei of neighbors[zeroIdx]) {
      const chars = state.split("");
      [chars[zeroIdx], chars[nei]] = [chars[nei], chars[zeroIdx]];
      const nextState = chars.join("");

      if (!visited.has(nextState)) {
        visited.add(nextState);
        queue.push([nextState, steps + 1]);
      }
    }
  }

  return -1;
}
