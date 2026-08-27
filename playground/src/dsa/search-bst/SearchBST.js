// ============================================================================
// APPROACH: Iterative Search
// ============================================================================
/**
 * INTUITION:
 * A BST has the property that for any node:
 * - Left child < Node
 * - Right child > Node
 *
 * We can traverse down the tree like a binary search in a sorted array.
 * If target < current, go left. If target > current, go right.
 *
 * Time Complexity: O(H) - Where H is height of tree (log N for balanced, N for skewed).
 * Space Complexity: O(1) - Iterative approach uses constant extra space.
 */
const searchBST = (root, val) => {
  while (root != null && root.val != val) {
    root = root.val > val ? root.left : root.right;
  }
  return root;
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
console.log("=== Search BST Tests ===\n");

//      4
//     / \
//    2   7
const tree = new TreeNode(4, new TreeNode(2), new TreeNode(7));

const result = searchBST(tree, 2);
console.log("Test 1 (Found):", result ? result.val : null); // Expected: 2

const result2 = searchBST(tree, 5);
console.log("Test 2 (Not Found):", result2); // Expected: null

module.exports = { searchBST };
