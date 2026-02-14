/**
 * ============================================================================
 * PROBLEM: Binary Tree Right Side View (LeetCode #199)
 * ============================================================================
 *
 * Given the root of a binary tree, imagine yourself standing on the right
 * side of it. Return the values of the nodes you can see ordered from top
 * to bottom.
 *
 * Example 1:
 *         1        <--- 1
 *        / \
 *       2   3      <--- 3
 *        \   \
 *         5   4    <--- 4
 *
 * Input: root = [1,2,3,null,5,null,4]
 * Output: [1,3,4]
 *
 * Example 2:
 *     1            <--- 1
 *      \
 *       3          <--- 3
 *
 * Input: root = [1,null,3]
 * Output: [1,3]
 *
 * Example 3:
 * Input: root = []
 * Output: []
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 100]
 * - -100 <= Node.val <= 100
 *
 * Approach: BFS level order, take last node of each level
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
 * @return {number[]}
 */
const rightSideView = (root) => {
  // If tree is empty, nothing is visible
  if (!root) return [];

  // Result array to store rightmost nodes
  const res = [];

  // Queue for level-order traversal (BFS)
  const queue = [root];

  // Continue while there are nodes to process
  while (queue.length) {
    // Number of nodes at the current level
    const size = queue.length;

    // Process exactly one level
    for (let i = 0; i < size; i++) {
      const node = queue.shift();

      // The last node in this level is visible from the right
      if (i === size - 1) {
        res.push(node.val);
      }

      // Add children for the next level
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  // Return the visible nodes from the right side
  return res;
};

// ============================================================================
// ALTERNATIVE SOLUTION: DFS (right child first)
// ============================================================================

const rightSideViewDFS = (root) => {
  const result = [];

  function dfs(node, depth) {
    if (!node) return;

    // First time we reach this depth, it's the rightmost node
    if (depth === result.length) {
      result.push(node.val);
    }

    // Visit right first, then left
    dfs(node.right, depth + 1);
    dfs(node.left, depth + 1);
  }

  dfs(root, 0);
  return result;
};

// ============================================================================
// BONUS: Left Side View
// ============================================================================

const leftSideView = (root) => {
  if (!root) return [];

  const res = [];
  const queue = [root];

  while (queue.length) {
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const node = queue.shift();

      // First node in level is visible from the left
      if (i === 0) {
        res.push(node.val);
      }

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return res;
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
//         1        <--- 1
//        / \
//       2   3      <--- 3
//        \   \
//         5   4    <--- 4
const tree1 = buildTree([1, 2, 3, null, 5, null, 4]);
console.log("Test 1 (Right View):", rightSideView(tree1));
// Expected: [1, 3, 4]

// Test Case 2: Right-skewed tree
//     1            <--- 1
//      \
//       3          <--- 3
const tree2 = buildTree([1, null, 3]);
console.log("Test 2 (Right View):", rightSideView(tree2));
// Expected: [1, 3]

// Test Case 3: Empty tree
console.log("Test 3 (Right View):", rightSideView(null));
// Expected: []

// Test Case 4: Single node
const tree4 = buildTree([1]);
console.log("Test 4 (Right View):", rightSideView(tree4));
// Expected: [1]

// Test Case 5: Left-heavy tree (left child visible from right at deeper level)
//         1        <--- 1
//        / \
//       2   3      <--- 3
//      /
//     4            <--- 4
const tree5 = buildTree([1, 2, 3, 4]);
console.log("Test 5 (Right View):", rightSideView(tree5));
// Expected: [1, 3, 4]

// Test Case 6: Complete binary tree
//           1          <--- 1
//         /   \
//        2     3       <--- 3
//       / \   / \
//      4   5 6   7     <--- 7
const tree6 = buildTree([1, 2, 3, 4, 5, 6, 7]);
console.log("Test 6 (Right View):", rightSideView(tree6));
// Expected: [1, 3, 7]

// Test DFS approach
console.log("\n--- Using DFS Approach ---");
console.log("Test 1 (DFS):", rightSideViewDFS(tree1)); // [1, 3, 4]
console.log("Test 6 (DFS):", rightSideViewDFS(tree6)); // [1, 3, 7]

// Test Left Side View
console.log("\n--- Left Side View ---");
console.log("Test 1 (Left View):", leftSideView(tree1)); // [1, 2, 5]
console.log("Test 6 (Left View):", leftSideView(tree6)); // [1, 2, 4]
