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
