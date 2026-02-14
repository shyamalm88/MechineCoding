/**
 * ============================================================================
 * PROBLEM: Lowest Common Ancestor of a Binary Tree (LeetCode #236)
 * ============================================================================
 *
 * Given a binary tree, find the lowest common ancestor (LCA) of two given
 * nodes in the tree.
 *
 * The lowest common ancestor is defined as the lowest node in T that has
 * both p and q as descendants (where we allow a node to be a descendant
 * of itself).
 *
 * Example 1:
 *            3
 *          /   \
 *         5     1
 *        / \   / \
 *       6   2 0   8
 *          / \
 *         7   4
 *
 * Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
 * Output: 3
 * Explanation: The LCA of nodes 5 and 1 is 3.
 *
 * Example 2:
 * Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
 * Output: 5
 * Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a
 *              descendant of itself.
 *
 * Example 3:
 * Input: root = [1,2], p = 1, q = 2
 * Output: 1
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [2, 10^5]
 * - -10^9 <= Node.val <= 10^9
 * - All Node.val are unique
 * - p != q
 * - p and q will exist in the tree
 *
 * Approach: Post-order DFS (bottom-up recursion)
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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
const lowestCommonAncestor = (root, p, q) => {
  // Base case: if we hit null, or found p or q, return that node
  if (!root || root === p || root === q) {
    return root;
  }

  // Recursively search in left and right subtrees
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // If both sides returned a node,
  // p and q are on different sides → this is the LCA
  // the root is the lca itself.
  if (left && right) {
    return root;
  }

  // Otherwise, return whichever side found something
  return left || right;
};

// ============================================================================
// SAMPLE TEST CASES
// ============================================================================

// Helper function to build tree and return node references
function buildTreeWithRefs(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return { root: null, nodes: {} };

  const nodes = {};
  const root = new TreeNode(arr[0]);
  nodes[arr[0]] = root;

  const queue = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();

    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      nodes[arr[i]] = node.left;
      queue.push(node.left);
    }
    i++;

    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      nodes[arr[i]] = node.right;
      queue.push(node.right);
    }
    i++;
  }

  return { root, nodes };
}

// Test Case 1:
//            3
//          /   \
//         5     1
//        / \   / \
//       6   2 0   8
//          / \
//         7   4
const { root: tree1, nodes: nodes1 } = buildTreeWithRefs([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
console.log("Test 1:", lowestCommonAncestor(tree1, nodes1[5], nodes1[1]).val);
// Expected: 3 (LCA of 5 and 1)

console.log("Test 2:", lowestCommonAncestor(tree1, nodes1[5], nodes1[4]).val);
// Expected: 5 (LCA of 5 and 4, node is ancestor of itself)

console.log("Test 3:", lowestCommonAncestor(tree1, nodes1[6], nodes1[4]).val);
// Expected: 5 (LCA of 6 and 4)

console.log("Test 4:", lowestCommonAncestor(tree1, nodes1[7], nodes1[8]).val);
// Expected: 3 (LCA of 7 and 8)

// Test Case 5: Simple tree
//       1
//      /
//     2
const { root: tree2, nodes: nodes2 } = buildTreeWithRefs([1, 2]);
console.log("Test 5:", lowestCommonAncestor(tree2, nodes2[1], nodes2[2]).val);
// Expected: 1
