/**
 * ============================================================================
 * PROBLEM: Flatten Binary Tree to Linked List (LeetCode #114)
 * ============================================================================
 * Given the root of a binary tree, flatten the tree into a "linked list":
 * - The "linked list" should use the same TreeNode class where the right child
 *   pointer points to the next node in the list and the left child pointer is
 *   always null.
 * - The "linked list" should be in the same order as a pre-order traversal of
 *   the binary tree.
 *
 * Example 1:
 * Input: root = [1,2,5,3,4,null,6]
 * Output: [1,null,2,null,3,null,4,null,5,null,6]
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 2000].
 * - -100 <= Node.val <= 100
 */

// ============================================================================
// APPROACH: Reverse Post-Order DFS
// ============================================================================
/**
 * INTUITION:
 * We need Pre-order: Root -> Left -> Right.
 * If we traverse in REVERSE (Right -> Left -> Root), we can maintain a `prev`
 * pointer to the previously processed node (which will be the "next" node in
 * the final list).
 *
 * 1. Go Right.
 * 2. Go Left.
 * 3. Process Root:
 *    - root.right = prev
 *    - root.left = null
 *    - prev = root
 *
 * Time Complexity: O(N)
 * Space Complexity: O(H)
 */
const treeToList = (root) => {
  let prev = null;

  const dfs = (node) => {
    if (!node) return;

    // 1. Traverse Right subtree first (Reverse Pre-order)
    dfs(node.right);

    // 2. Traverse Left subtree second
    dfs(node.left);

    // 3. Rewire the current node
    // The 'prev' node is the one that should come AFTER the current node in the flattened list.
    node.right = prev;
    node.left = null; // Ensure left child is null as per requirement

    // Update 'prev' to be the current node for the next step up the recursion
    prev = node;
  };

  dfs(root);
};

module.exports = { treeToList };
