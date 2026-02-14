/**
 * ============================================================================
 * PROBLEM: Symmetric Tree (LeetCode #101)
 * ============================================================================
 * Given the root of a binary tree, check whether it is a mirror of itself
 * (i.e., symmetric around its center).
 *
 * Example 1:
 *         1
 *        / \
 *       2   2
 *      / \ / \
 *     3  4 4  3
 * Output: true
 *
 * Example 2:
 *         1
 *        / \
 *       2   2
 *        \   \
 *         3   3
 * Output: false
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [1, 1000].
 * - -100 <= Node.val <= 100
 */

// ============================================================================
// APPROACH: Recursive DFS (Two Pointers)
// ============================================================================
/**
 * INTUITION:
 * A tree is symmetric if the left subtree is a mirror reflection of the right subtree.
 * We need a helper function that takes two nodes (let's say t1 and t2) and checks:
 * 1. Are their values equal?
 * 2. Is t1.left a mirror of t2.right?
 * 3. Is t1.right a mirror of t2.left?
 *
 * Time Complexity: O(N) - We visit every node once.
 * Space Complexity: O(H) - Recursion stack.
 */
const isSymmetric = (root) => {
  if (!root) return true;

  const isMirror = (t1, t2) => {
    // Base cases
    if (!t1 && !t2) return true; // Both null -> symmetric
    if (!t1 || !t2) return false; // One null, one not -> not symmetric
    if (t1.val !== t2.val) return false; // Values mismatch -> not symmetric

    // Recurse:
    // Compare outer pairs (t1.left, t2.right)
    // Compare inner pairs (t1.right, t2.left)
    return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
  };

  return isMirror(root.left, root.right);
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
console.log("=== Symmetric Tree Tests ===\n");

// Case 1: Symmetric
const tree1 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(3), new TreeNode(4)),
  new TreeNode(2, new TreeNode(4), new TreeNode(3))
);
console.log("Test 1:", isSymmetric(tree1)); // Expected: true

// Case 2: Not Symmetric
const tree2 = new TreeNode(
  1,
  new TreeNode(2, null, new TreeNode(3)),
  new TreeNode(2, null, new TreeNode(3))
);
console.log("Test 2:", isSymmetric(tree2)); // Expected: false

module.exports = { isSymmetric };
