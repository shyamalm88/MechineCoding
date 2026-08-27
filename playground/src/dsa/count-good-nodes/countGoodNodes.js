// ============================================================================
// APPROACH: DFS with State (Max So Far)
// ============================================================================
/**
 * INTUITION:
 * We need to traverse the tree (DFS) and keep track of the maximum value we have
 * encountered so far in the current path from the root.
 *
 * For each node:
 * 1. Compare node.val with maxSoFar.
 * 2. If node.val >= maxSoFar, it's a "Good Node". Increment count and update maxSoFar.
 * 3. Continue to children passing the (possibly updated) maxSoFar.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(H)
 */
const goodNodes = (root) => {
  let count = 0;

  const dfs = (node, maxSoFar) => {
    if (!node) return;

    // Check if current node is "Good"
    if (node.val >= maxSoFar) {
      count++;
      maxSoFar = node.val; // Update max for children
    }

    dfs(node.left, maxSoFar);
    dfs(node.right, maxSoFar);
  };

  // Start DFS with root and extremely small initial max
  dfs(root, -Infinity);

  return count;
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
console.log("=== Count Good Nodes Tests ===\n");

// Case 1: [3,1,4,3,null,1,5]
const tree1 = new TreeNode(
  3,
  new TreeNode(1, new TreeNode(3)),
  new TreeNode(4, new TreeNode(1), new TreeNode(5))
);
console.log("Test 1:", goodNodes(tree1)); // Expected: 4 (3, 3, 4, 5)

module.exports = { goodNodes };
