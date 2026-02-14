/**
 * ============================================================================
 * PROBLEM: Validate Binary Search Tree (LeetCode #98)
 * ============================================================================
 *
 * Given the root of a binary tree, determine if it is a valid binary search
 * tree (BST).
 *
 * A valid BST is defined as follows:
 * - The left subtree of a node contains only nodes with keys less than
 *   the node's key.
 * - The right subtree of a node contains only nodes with keys greater than
 *   the node's key.
 * - Both the left and right subtrees must also be binary search trees.
 *
 * Example 1:
 *       2
 *      / \
 *     1   3
 *
 * Input: root = [2,1,3]
 * Output: true
 *
 * Example 2:
 *       5
 *      / \
 *     1   4
 *        / \
 *       3   6
 *
 * Input: root = [5,1,4,null,null,3,6]
 * Output: false
 * Explanation: The root node's value is 5 but its right child's value is 4.
 *
 * Example 3 (Tricky case):
 *       5
 *      / \
 *     4   6
 *        / \
 *       3   7
 *
 * Input: root = [5,4,6,null,null,3,7]
 * Output: false
 * Explanation: 3 is in right subtree of 5, but 3 < 5. Invalid!
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [1, 10^4]
 * - -2^31 <= Node.val <= 2^31 - 1
 *
 * Approach: DFS with valid range propagation
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(h) - recursion stack, h = height of tree
 * ============================================================================
 */

// Definition for a binary tree node
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * @param {TreeNode} root
 * @return {boolean}
 */
const isValidBST = (root) => {
  // Helper DFS function that carries valid range for each node
  function dfs(node, min, max) {
    // Base case:
    // An empty subtree is always a valid BST
    if (!node) return true;

    // The current node must lie strictly between min and max
    if (node.val <= min || node.val >= max) {
      return false;
    }

    // Left subtree:
    //   values must be < current node's value
    // Right subtree:
    //   values must be > current node's value
    return dfs(node.left, min, node.val) && dfs(node.right, node.val, max);
  }

  // Start with the widest possible range
  return dfs(root, -Infinity, Infinity);
};

// ============================================================================
// ALTERNATIVE SOLUTION: Inorder Traversal (should produce sorted array)
// ============================================================================

const isValidBSTInorder = (root) => {
  let prev = -Infinity;

  function inorder(node) {
    if (!node) return true;

    // Visit left
    if (!inorder(node.left)) return false;

    // Check current - should be greater than previous
    if (node.val <= prev) return false;
    prev = node.val;

    // Visit right
    return inorder(node.right);
  }

  return inorder(root);
};

// ============================================================================
// SAMPLE TEST CASES
// ============================================================================

// Helper function to build tree from array (level order)
function buildTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;

  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();

    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;

    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

// Test Case 1: Valid BST
//       2
//      / \
//     1   3
const tree1 = buildTree([2, 1, 3]);
console.log("Test 1:", isValidBST(tree1));
// Expected: true

// Test Case 2: Invalid BST (right child smaller than root)
//       5
//      / \
//     1   4
//        / \
//       3   6
const tree2 = buildTree([5, 1, 4, null, null, 3, 6]);
console.log("Test 2:", isValidBST(tree2));
// Expected: false (4 < 5, but 4 is in right subtree)

// Test Case 3: Invalid BST (tricky - node violates ancestor constraint)
//       5
//      / \
//     4   6
//        / \
//       3   7
const tree3 = buildTree([5, 4, 6, null, null, 3, 7]);
console.log("Test 3:", isValidBST(tree3));
// Expected: false (3 is in right subtree of 5, but 3 < 5)

// Test Case 4: Single node
const tree4 = buildTree([1]);
console.log("Test 4:", isValidBST(tree4));
// Expected: true

// Test Case 5: Valid BST - larger tree
//           8
//         /   \
//        4     12
//       / \   /  \
//      2   6 10   14
const tree5 = buildTree([8, 4, 12, 2, 6, 10, 14]);
console.log("Test 5:", isValidBST(tree5));
// Expected: true

// Test Case 6: Duplicate values (invalid in BST)
//       2
//      / \
//     2   2
const tree6 = buildTree([2, 2, 2]);
console.log("Test 6:", isValidBST(tree6));
// Expected: false (BST requires strictly less/greater)

// Test Case 7: Left-skewed valid BST
//     3
//    /
//   2
//  /
// 1
const tree7 = buildTree([3, 2, null, 1]);
console.log("Test 7:", isValidBST(tree7));
// Expected: true

// Test using inorder solution
console.log("\n--- Using Inorder Approach ---");
console.log("Test 1 (Inorder):", isValidBSTInorder(tree1)); // true
console.log("Test 2 (Inorder):", isValidBSTInorder(tree2)); // false
console.log("Test 5 (Inorder):", isValidBSTInorder(tree5)); // true
