// ============================================================================
// APPROACH: Post-Order DFS (Height Calculation)
// ============================================================================
/**
 * INTUITION:
 * The diameter at a specific node is the sum of the heights of its left and
 * right subtrees (LeftHeight + RightHeight).
 *
 * We traverse every node, calculate the diameter passing through it, and
 * update a global maximum.
 * The function itself returns the Height of the node to its parent.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(H)
 */
const diameterOfBinaryTree = (root) => {
  let maxDiameter = 0;

  const height = (node) => {
    if (!node) return 0;

    const leftH = height(node.left);
    const rightH = height(node.right);

    // 1. Calculate diameter passing through this node.
    // Diameter = Left Height + Right Height (edges connecting left and right subtrees via current node)
    maxDiameter = Math.max(maxDiameter, leftH + rightH);

    // 2. Return the height of this node to its parent.
    // Height = 1 (current edge) + max height of children
    return 1 + Math.max(leftH, rightH);
  };

  height(root);
  return maxDiameter;
};

// Definition for a binary tree node
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

console.log("=== Diameter of Binary Tree Tests ===\n");
const tree = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3)
);
console.log("Test 1:", diameterOfBinaryTree(tree)); // Expected: 3

module.exports = { diameterOfBinaryTree };
