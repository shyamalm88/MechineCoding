/**
 * ============================================================================
 * PROBLEM: Diameter of Binary Tree (LeetCode #543)
 * ============================================================================
 * Given the root of a binary tree, return the length of the diameter of the tree.
 *
 * The diameter of a binary tree is the length of the longest path between any
 * two nodes in a tree. This path may or may not pass through the root.
 *
 * The length of a path between two nodes is represented by the number of edges
 * between them.
 *
 * Example 1:
 * Input: root = [1,2,3,4,5]
 * Output: 3
 * Explanation: 3 is the length of the path [4,2,1,3] or [5,2,1,3].
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [1, 10^4].
 * - -100 <= Node.val <= 100
 */

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

    // 1. Update global max diameter found so far
    // Diameter passing through this node = left height + right height
    maxDiameter = Math.max(maxDiameter, leftH + rightH);

    // 2. Return height of this node to parent
    // Height = 1 + max of children heights
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
