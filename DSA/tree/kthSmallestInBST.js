/**
 * ============================================================================
 * PROBLEM: Kth Smallest Element in a BST (LeetCode #230)
 * ============================================================================
 * Given the root of a binary search tree, and an integer k, return the kth
 * smallest value (1-indexed) of all the values of the nodes in the tree.
 *
 * Example 1:
 * Input: root = [3,1,4,null,2], k = 1
 * Output: 1
 *
 * Example 2:
 * Input: root = [5,3,6,2,4,null,null,1], k = 3
 * Output: 3
 *
 * Constraints:
 * - The number of nodes in the tree is n.
 * - 1 <= k <= n <= 10^4
 * - 0 <= Node.val <= 10^4
 */

// ============================================================================
// APPROACH: Inorder Traversal (DFS)
// ============================================================================
/**
 * INTUITION:
 * An Inorder traversal (Left -> Root -> Right) of a BST visits nodes in
 * sorted ascending order.
 * We simply perform an inorder traversal and decrement k each time we visit
 * a node. When k reaches 0, we have found the kth smallest element.
 *
 * Time Complexity: O(N) (Average O(k) if we stop early)
 * Space Complexity: O(H)
 */
const kThSmallestBST = (root, k) => {
  let count = 0; // Tracks how many nodes we have visited so far
  let result = null; // Stores the kth smallest value once found

  // Inorder DFS: Left → Node → Right
  const dfs = (node) => {
    // Base case: empty node
    if (!node) return;

    // Optimization: if result already found, stop further traversal
    if (result !== null) return;

    // 1️⃣ Visit left subtree (smaller values in BST)
    dfs(node.left);

    // 2️⃣ Process current node
    count++;
    if (count === k) {
      result = node.val; // kth smallest found
      return;
    }

    // 3️⃣ Visit right subtree (larger values in BST)
    dfs(node.right);
  };

  dfs(root);
  return result;
};

module.exports = { kThSmallestBST };
