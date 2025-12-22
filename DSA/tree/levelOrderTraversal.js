/**
 * ============================================================================
 * PROBLEM: Binary Tree Level Order Traversal (LeetCode #102)
 * ============================================================================
 *
 * Given the root of a binary tree, return the level order traversal of its
 * nodes' values. (i.e., from left to right, level by level).
 *
 * Example 1:
 *         3
 *        / \
 *       9  20
 *          / \
 *         15  7
 *
 * Input: root = [3,9,20,null,null,15,7]
 * Output: [[3],[9,20],[15,7]]
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
 * - -1000 <= Node.val <= 1000
 *
 * Approach: BFS using queue
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
const levelOrderTraversal = (root) => {
  // If tree is empty, return empty result
  if (!root) return [];

  // Final result: array of levels
  const result = [];

  // Queue for BFS — ALWAYS store nodes, never values
  const queue = [root];

  // Run BFS while there are nodes to process
  while (queue.length > 0) {
    // Snapshot of current level size
    const levelSize = queue.length;

    // This array will store values of ONE level
    const currentLevel = [];

    // Process exactly `levelSize` nodes
    for (let i = 0; i < levelSize; i++) {
      // Remove node from front of queue
      const node = queue.shift();

      // Store node value in current level
      currentLevel.push(node.val);

      // Add children to queue (for next level)
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    // After finishing this level, save it
    result.push(currentLevel);
  }

  return result;
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
console.log("Test 1:", JSON.stringify(levelOrderTraversal(tree1)));
// Expected: [[3],[9,20],[15,7]]

// Test Case 2: Single node
const tree2 = buildTree([1]);
console.log("Test 2:", JSON.stringify(levelOrderTraversal(tree2)));
// Expected: [[1]]

// Test Case 3: Empty tree
console.log("Test 3:", JSON.stringify(levelOrderTraversal(null)));
// Expected: []

// Test Case 4: Complete binary tree
//           1
//         /   \
//        2     3
//       / \   / \
//      4   5 6   7
const tree4 = buildTree([1, 2, 3, 4, 5, 6, 7]);
console.log("Test 4:", JSON.stringify(levelOrderTraversal(tree4)));
// Expected: [[1],[2,3],[4,5,6,7]]

// Test Case 5: Left-heavy tree
//         1
//        /
//       2
//      /
//     3
const tree5 = buildTree([1, 2, null, 3]);
console.log("Test 5:", JSON.stringify(levelOrderTraversal(tree5)));
// Expected: [[1],[2],[3]]

// Test Case 6: Right-heavy tree
//     1
//      \
//       2
//        \
//         3
const tree6 = buildTree([1, null, 2, null, 3]);
console.log("Test 6:", JSON.stringify(levelOrderTraversal(tree6)));
// Expected: [[1],[2],[3]]
