/**
 * ============================================================================
 * PROBLEM: Game of Life (LeetCode #289)
 * ============================================================================
 * Given an m x n grid `board` where each cell is either 1 (live) or 0 (dead),
 * compute the next state of the board using Conway's Game of Life rules,
 * applied SIMULTANEOUSLY to every cell:
 *
 * 1. A live cell with fewer than 2 live neighbors dies (underpopulation).
 * 2. A live cell with 2 or 3 live neighbors lives on.
 * 3. A live cell with more than 3 live neighbors dies (overpopulation).
 * 4. A dead cell with exactly 3 live neighbors becomes a live cell.
 *
 * Neighbors = the 8 horizontally, vertically, or diagonally adjacent cells.
 *
 * Example 1:
 * Input:  board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]
 * Output: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]
 *
 * Example 2:
 * Input:  board = [[1,1],[1,0]]
 * Output: [[1,1],[1,1]]
 *
 * Constraints:
 * - m == board.length
 * - n == board[i].length
 * - 1 <= m, n <= 25
 * - board[i][j] is 0 or 1
 *
 * Follow-up: solve it IN-PLACE, without allocating a second grid.
 */

// ============================================================================
// APPROACH: In-Place State Encoding (4-state trick)
// ============================================================================
/**
 * STORY / INTUITION:
 * The hard part is that EVERY cell's next state depends on its neighbors'
 * CURRENT state — but if we overwrite a cell with its next state too early,
 * neighboring cells will read the wrong (already-updated) value.
 *
 * Fix: use TWO EXTRA CODES that encode "what it WAS" and "what it BECOMES"
 * in the same cell, so a single pass can both read old state and stage new
 * state:
 *
 *   0 = was dead,  stays dead
 *   1 = was alive, stays alive
 *   2 = was alive, BECOMES dead   (dying)
 *   3 = was dead,  BECOMES alive  (reviving)
 *
 * When counting live NEIGHBORS, a neighbor counts as "currently alive" if
 * its value is 1 OR 2 — both started this round as alive; only the FUTURE
 * state differs, which doesn't matter for counting THIS round.
 *
 * Pass 1: for every cell, count live neighbors using the 1-or-2 rule above,
 * then apply the rules to decide if this cell's value should become 2 or 3
 * (i.e. flip in the next pass). Leave 0s and 1s that don't change as-is.
 *
 * Pass 2: sweep the board once more — any 2 becomes 0, any 3 becomes 1.
 *
 * DRY RUN: board = [[1,1],[1,0]]
 * Pass 1:
 *   (0,0)=1: neighbors (0,1)=1,(1,0)=1,(1,1)=0 -> 2 live -> rule 2: stays alive (1)
 *   (0,1)=1: neighbors (0,0)=1,(1,0)=1,(1,1)=0 -> 2 live -> stays alive (1)
 *   (1,0)=1: neighbors (0,0)=1,(0,1)=1,(1,1)=0 -> 2 live -> stays alive (1)
 *   (1,1)=0: neighbors (0,0)=1,(0,1)=1,(1,0)=1 -> 3 live -> rule 4: becomes alive (3)
 * After pass 1: [[1,1],[1,3]]
 * Pass 2: 3 -> 1
 * Result: [[1,1],[1,1]] ✓
 *
 * Time:  O(rows * cols) — two passes, O(1) work per cell (8 neighbors)
 * Space: O(1) — extra states encoded in the existing grid
 */
const gameOfLife = (board) => {
  const rows = board.length;
  const cols = board[0].length;

  const countLiveNeighbors = (r, c) => {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (board[nr][nc] === 1 || board[nr][nc] === 2) count++;
      }
    }
    return count;
  };

  // Pass 1: stage transitions using codes 2 (alive -> dead) and 3 (dead -> alive)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const liveNeighbors = countLiveNeighbors(r, c);
      const isAlive = board[r][c] === 1;

      if (isAlive && (liveNeighbors < 2 || liveNeighbors > 3)) {
        board[r][c] = 2; // dying
      } else if (!isAlive && liveNeighbors === 3) {
        board[r][c] = 3; // reviving
      }
    }
  }

  // Pass 2: resolve staged transitions into final 0/1 values
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 2) board[r][c] = 0;
      else if (board[r][c] === 3) board[r][c] = 1;
    }
  }

  return board;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Game of Life Tests ===\n");

console.log(
  "Test 1:",
  JSON.stringify(
    gameOfLife([
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ])
  )
);
// Expected: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]

console.log(
  "Test 2:",
  JSON.stringify(
    gameOfLife([
      [1, 1],
      [1, 0],
    ])
  )
);
// Expected: [[1,1],[1,1]]

module.exports = { gameOfLife };
