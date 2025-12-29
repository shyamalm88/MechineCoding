/**
 * ============================================================================
 * PROBLEM: Binary Tree Maximum Path Sum (LeetCode #124)
 * ============================================================================
 * A path in a binary tree is a sequence of nodes where each pair of adjacent
 * nodes in the sequence has an edge connecting them. A node can only appear
 * in the sequence at most once. Note that the path does not need to pass
 * through the root.
 *
 * The path sum is the sum of the node's values in the path.
 * Given the root of a binary tree, return the maximum path sum of any non-empty path.
 *
 * Example 1:
 * Input: root = [1,2,3]
 * Output: 6 (2 -> 1 -> 3)
 *
 * Example 2:
 * Input: root = [-10,9,20,null,null,15,7]
 * Output: 42 (15 -> 20 -> 7)
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [1, 3 * 10^4].
 * - -1000 <= Node.val <= 1000
 */

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

    // Recursively get max gain from left and right subtrees
    // If gain is negative, we ignore it (take 0)
    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);

    // 1. Calculate max path sum assuming 'node' is the highest point (peak)
    // This path connects left child -> node -> right child
    const currentPathSum = node.val + leftGain + rightGain;

    // 2. Update global maximum
    globalMax = Math.max(globalMax, currentPathSum);

    // 3. Return max gain to parent
    // The parent can only extend ONE of our branches, so we pick the best one.
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
