/**
 * ============================================================================
 * PROBLEM: Search in a Binary Search Tree (LeetCode #700)
 * ============================================================================
 * You are given the root of a binary search tree (BST) and an integer val.
 *
 * Find the node in the BST that the node's value equals val and return the
 * subtree rooted with that node. If such a node does not exist, return null.
 *
 * Example 1:
 * Input: root = [4,2,7,1,3], val = 2
 * Output: [2,1,3]
 *
 * Example 2:
 * Input: root = [4,2,7,1,3], val = 5
 * Output: []
 *
 * Constraints:
 * - The number of nodes is in the range [1, 5000].
 * - 1 <= Node.val <= 10^7
 * - root is a binary search tree.
 * - 1 <= val <= 10^7
 */

// ============================================================================
// APPROACH: Iterative Search
// ============================================================================
/**
 * INTUITION:
 * A BST has the property that for any node:
 * - Left child < Node
 * - Right child > Node
 *
 * We can traverse down the tree like a binary search in a sorted array.
 * If target < current, go left. If target > current, go right.
 *
 * Time Complexity: O(H) - Where H is height of tree (log N for balanced, N for skewed).
 * Space Complexity: O(1) - Iterative approach uses constant extra space.
 */
const searchBST = (root, val) => {
  while (root != null && root.val != val) {
    root = root.val > val ? root.left : root.right;
  }
  return root;
};

// Simple TreeNode definition for testing
function TreeNode(val, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Search BST Tests ===\n");

//      4
//     / \
//    2   7
const tree = new TreeNode(4, new TreeNode(2), new TreeNode(7));

const result = searchBST(tree, 2);
console.log("Test 1 (Found):", result ? result.val : null); // Expected: 2

const result2 = searchBST(tree, 5);
console.log("Test 2 (Not Found):", result2); // Expected: null

module.exports = { searchBST };
