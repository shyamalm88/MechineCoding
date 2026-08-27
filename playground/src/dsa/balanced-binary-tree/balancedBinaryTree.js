// ============================================================================
// APPROACH: Bottom-Up DFS
// ============================================================================
/**
 * INTUITION:
 * Instead of calculating height for every node from the top down (which would be O(N^2)),
 * we can check balance from the bottom up.
 *
 * We use a helper function that returns the height of the tree if it is balanced,
 * or -1 if it is unbalanced.
 *
 * 1. If a subtree returns -1, the current tree is also unbalanced (-1).
 * 2. If the absolute difference between left and right height > 1, return -1.
 * 3. Otherwise, return 1 + max(leftHeight, rightHeight).
 *
 * Time Complexity: O(N) - We visit every node once.
 * Space Complexity: O(H) - Recursion stack.
 */
const isBalanced = (root) => {
  const checkHeight = (node) => {
    if (!node) return 0;

    const leftHeight = checkHeight(node.left);
    if (leftHeight === -1) return -1; // Propagate failure

    const rightHeight = checkHeight(node.right);
    if (rightHeight === -1) return -1; // Propagate failure

    if (Math.abs(leftHeight - rightHeight) > 1) {
      return -1; // Current node is unbalanced
    }

    return 1 + Math.max(leftHeight, rightHeight);
  };

  return checkHeight(root) !== -1;
};

// Definition for a binary tree node
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Balanced Binary Tree Tests ===\n");

// Case 1: Balanced
//     3
//    / \
//   9  20
//      / \
//     15  7
const tree1 = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7))
);
console.log("Test 1:", isBalanced(tree1)); // Expected: true

// Case 2: Unbalanced
//       1
//      /
//     2
//    /
//   3
const tree2 = new TreeNode(1, new TreeNode(2, new TreeNode(3)));
console.log("Test 2:", isBalanced(tree2)); // Expected: false

module.exports = { isBalanced };
