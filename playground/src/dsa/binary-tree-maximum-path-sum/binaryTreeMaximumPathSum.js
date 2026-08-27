// ============================================================================
// APPROACH: Post-Order DFS (Global Max Update)
// ============================================================================
/**
 * INTUITION:
 * For any node, the maximum path passing through it (as the "peak" of the path)
 * is: Node.val + MaxLeftGain + MaxRightGain.
 *
 * However, to its parent, this node can only contribute one branch (it cannot
 * split). So it returns: Node.val + max(MaxLeftGain, MaxRightGain).
 *
 * Important: If a branch has a negative sum, we should ignore it (treat gain as 0).
 *
 * Time Complexity: O(N)
 * Space Complexity: O(H)
 */
const maxPathSum = (root) => {
  let globalMax = -Infinity;

  const dfs = (node) => {
    if (!node) return 0;

    // 1. Recursively get max gain from left and right subtrees.
    // If a subtree returns a negative gain, we ignore it (max(..., 0)) because adding it would decrease the sum.
    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);

    // 2. Calculate the price of the path where 'node' is the highest point (the "peak").
    // This path goes: Left Child -> Node -> Right Child
    const currentPathSum = node.val + leftGain + rightGain;

    // 3. Update the global maximum if this new path is better
    globalMax = Math.max(globalMax, currentPathSum);

    // 4. Return the max gain this node can contribute to its parent.
    // A path can only go up from one child, through the node, to the parent. It cannot split.
    return node.val + Math.max(leftGain, rightGain);
  };

  dfs(root);
  return globalMax;
};

// Definition for a binary tree node
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

console.log("=== Max Path Sum Tests ===\n");
const tree = new TreeNode(
  -10,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7))
);
console.log("Test 1:", maxPathSum(tree)); // Expected: 42

module.exports = { maxPathSum };
