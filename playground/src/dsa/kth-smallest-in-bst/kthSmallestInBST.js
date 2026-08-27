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

    // Optimization: If we already found the kth element, stop traversing.
    if (result !== null) return;

    // 1️⃣ Visit left subtree (smaller values in BST)
    dfs(node.left);

    // 2️⃣ Process current node (Inorder position)
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
