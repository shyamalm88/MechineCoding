// ============================================================================
// APPROACH: Recursive DFS
// ============================================================================
/**
 * INTUITION:
 * To invert a tree, we need to swap the left and right children for every node
 * in the tree.
 *
 * Algorithm:
 * 1. Base case: If node is null, return null.
 * 2. Swap the left and right pointers of the current node.
 * 3. Recursively call invertTree on the left child.
 * 4. Recursively call invertTree on the right child.
 *
 * Time Complexity: O(N) - We visit every node once.
 * Space Complexity: O(H) - Recursion stack height.
 */
const invertTree = (root) => {
  if (!root) return null;

  // Swap children
  const temp = root.left;
  root.left = root.right;
  root.right = temp;

  // Recurse
  invertTree(root.left);
  invertTree(root.right);

  return root;
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
console.log("=== Invert Tree Tests ===\n");

// Helper to print level order for verification
const printLevelOrder = (root) => {
  if (!root) return [];
  const queue = [root];
  const res = [];
  while (queue.length) {
    const node = queue.shift();
    res.push(node ? node.val : null);
    if (node) {
      queue.push(node.left || null);
      queue.push(node.right || null);
    }
  }
  return res.filter((val) => val !== null); // Simplified for display
};

const tree1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
console.log("Original:", printLevelOrder(tree1));
const inverted1 = invertTree(tree1);
console.log("Inverted:", printLevelOrder(inverted1)); // Expected: [2, 3, 1]

module.exports = { invertTree };
