/**
 * ============================================================================
 * PROBLEM: Maximum Subtree Sum
 * ============================================================================
 * Given the root of a binary tree, find the maximum sum of any subtree.
 * A subtree's sum is the sum of the node's value and the sums of its
 * left and right subtrees.
 *
 * Example 1:
 *       1
 *      / \
 *     2   3
 *    / \ / \
 *   4  5 6  7
 *
 * Input: root = [1,2,3,4,5,6,7]
 * Output: 28 (The whole tree is the max subtree)
 *
 * Example 2:
 *       1
 *      / \
 *    -5   2
 *    / \
 *   0   3
 *
 * Input: root = [1,-5,2,0,3]
 * Output: 2 (Subtree rooted at 2)
 */

// ============================================================================
// APPROACH: DFS (Post-Order Traversal)
// ============================================================================
/**
 * INTUITION:
 * To know the sum of a subtree rooted at `node`, we need:
 * 1. The sum of the left subtree.
 * 2. The sum of the right subtree.
 * 3. The value of `node` itself.
 *
 * CurrentSum = Node.val + LeftSum + RightSum
 *
 * Since we need answers from children before processing the parent,
 * this is a Post-Order Traversal.
 *
 * Time Complexity: O(N) - We visit every node once.
 * Space Complexity: O(H) - Recursion stack height.
 */
const maxSubtreeSum = (root) => {
  let globalMax = -Infinity;

  const dfs = (node) => {
    if (!node) return 0;

    // Recursively get sum of left and right subtrees
    const leftSum = dfs(node.left);
    const rightSum = dfs(node.right);

    // Calculate sum of current subtree
    const currentSubtreeSum = node.val + leftSum + rightSum;

    // Update global maximum if this subtree is the largest found so far
    if (currentSubtreeSum > globalMax) {
      globalMax = currentSubtreeSum;
    }

    // Return current sum so the parent can use it
    return currentSubtreeSum;
  };

  dfs(root);
  return globalMax;
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
console.log("=== Max Subtree Sum Tests ===\n");

// Test 1: Simple Tree
//     1
//    / \
//   2   3
const tree1 = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log("Test 1:", maxSubtreeSum(tree1)); // Expected: 6 (1+2+3)

// Test 2: Negative values
//     1
//    / \
//  -5   4
const tree2 = new TreeNode(1, new TreeNode(-5), new TreeNode(4));
console.log("Test 2:", maxSubtreeSum(tree2)); // Expected: 4 (Subtree rooted at 4 is largest, whole tree is 0)

module.exports = { maxSubtreeSum };
