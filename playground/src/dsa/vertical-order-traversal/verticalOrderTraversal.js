// ============================================================================
// APPROACH: DFS collecting (col, row, val) + Sort
// ============================================================================
/**
 * STORY / INTUITION:
 * Give every node a coordinate, like a spreadsheet cell:
 * - root starts at (row=0, col=0)
 * - going left:  row+1, col-1
 * - going right: row+1, col+1
 *
 * DFS the whole tree collecting [col, row, val] triples — order of
 * collection doesn't matter, we'll sort everything at the end.
 *
 * Then sort by THREE keys, in priority order:
 *   1. col  (groups nodes into their vertical "columns", left to right)
 *   2. row  (top to bottom within a column)
 *   3. val  (tie-break when two nodes land on the exact same cell)
 *
 * Finally, walk the sorted list and start a new output group every time
 * the column number changes.
 *
 * DRY RUN: root = [1,2,3,4,6,5,7]  (full tree, 3 levels)
 * Coordinates:
 *   1 → (0,0)
 *   2 → (1,-1)   3 → (1,1)
 *   4 → (2,-2)   6 → (2,0)   5 → (2,0)   7 → (2,2)
 *
 * Triples: [0,0,1] [-1,1,2] [1,1,3] [-2,2,4] [0,2,6] [0,2,5] [2,2,7]
 *
 * Sort by (col, row, val):
 *   col=-2: [-2,2,4]
 *   col=-1: [-1,1,2]
 *   col= 0: [0,0,1], [0,2,5], [0,2,6]   ← 5 before 6 (same row, val tiebreak)
 *   col= 1: [1,1,3]
 *   col= 2: [2,2,7]
 *
 * Group by col: [[4],[2],[1,5,6],[3],[7]] ✓
 *
 * Time:  O(N log N) — dominated by the sort
 * Space: O(N) — storing one triple per node
 */
const verticalTraversal = (root) => {
  const nodes = []; // [col, row, val]

  const dfs = (node, row, col) => {
    if (!node) return;
    nodes.push([col, row, node.val]);
    dfs(node.left, row + 1, col - 1);
    dfs(node.right, row + 1, col + 1);
  };

  dfs(root, 0, 0);

  nodes.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0]; // col ascending
    if (a[1] !== b[1]) return a[1] - b[1]; // row ascending
    return a[2] - b[2]; // val ascending (tie-break)
  });

  const result = [];
  let lastCol = null;
  for (const [col, , val] of nodes) {
    if (col !== lastCol) {
      result.push([]);
      lastCol = col;
    }
    result[result.length - 1].push(val);
  }

  return result;
};

// Simple TreeNode definition for testing
function TreeNode(val, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Vertical Order Traversal Tests ===\n");

// Test 1: [3,9,20,null,null,15,7] → [[9],[3,15],[20],[7]]
const tree1 = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7))
);
console.log("Test 1:", JSON.stringify(verticalTraversal(tree1)));

// Test 2: [1,2,3,4,6,5,7] → [[4],[2],[1,5,6],[3],[7]]
const tree2 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(6)),
  new TreeNode(3, new TreeNode(5), new TreeNode(7))
);
console.log("Test 2:", JSON.stringify(verticalTraversal(tree2)));

module.exports = { verticalTraversal };
