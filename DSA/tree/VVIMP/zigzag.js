/**
 * ============================================================================
 * PROBLEM: Binary Tree Zigzag Level Order Traversal (LeetCode #103)
 * ============================================================================
 *
 * Given the root of a binary tree, return the zigzag level order traversal
 * of its nodes' values. (i.e., from left to right, then right to left for
 * the next level and alternate between).
 *
 * Example 1:
 *         3
 *        / \
 *       9  20
 *          / \
 *         15  7
 *
 * Input: root = [3,9,20,null,null,15,7]
 * Output: [[3],[20,9],[15,7]]
 *
 * Example 2:
 * Input: root = [1]
 * Output: [[1]]
 *
 * Example 3:
 * Input: root = []
 * Output: []
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 2000]
 * - -100 <= Node.val <= 100
 *
 * Approach: BFS with direction flag
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(n) - queue can hold up to n/2 nodes at last level
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
 * @return {number[][]}
 */
var zigzagLevelOrder = function (root) {
  if (!root) return []; // Base case: Empty tree

  const results = [];
  const queue = [root];
  let isLeftToRight = true; // 1. Start Direction: Normal

  // 2. Standard BFS Loop
  while (queue.length > 0) {
    const size = queue.length; // Snapshot size
    const level = []; // Holds values for this level

    for (let i = 0; i < size; i++) {
      const node = queue.shift();

      // 3. The Logic (Push vs Unshift)
      if (isLeftToRight) {
        level.push(node.val); // Normal Order
      } else {
        level.unshift(node.val); // Reverse Order
      }

      // 4. Add Children (Always Left then Right)
      // Even if printing right-to-left, we traverse the tree normally!
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    results.push(level);

    // 5. Flip the switch for next level
    isLeftToRight = !isLeftToRight;
  }

  return results;
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

// Test Case 1:
//         3
//        / \
//       9  20
//          / \
//         15  7
const tree1 = buildTree([3, 9, 20, null, null, 15, 7]);
console.log("Test 1:", zigzagLevelOrder(tree1));
// Expected: [[3], [20, 9], [15, 7]]

// Test Case 2: Single node
const tree2 = buildTree([1]);
console.log("Test 2:", zigzagLevelOrder(tree2));
// Expected: [[1]]

// Test Case 3: Empty tree
console.log("Test 3:", zigzagLevelOrder(null));
// Expected: []

// Test Case 4: Larger tree
//           1
//         /   \
//        2     3
//       / \   / \
//      4   5 6   7
const tree4 = buildTree([1, 2, 3, 4, 5, 6, 7]);
console.log("Test 4:", zigzagLevelOrder(tree4));
// Expected: [[1], [3, 2], [4, 5, 6, 7]]
