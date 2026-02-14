/**
 * ============================================================================
 * PROBLEM: Path Sum II (LeetCode #113)
 * ============================================================================
 *
 * Given the root of a binary tree and an integer targetSum, return all
 * root-to-leaf paths where the sum of the node values in the path equals
 * targetSum. Each path should be returned as a list of the node values,
 * not node references.
 *
 * A root-to-leaf path is a path starting from the root and ending at any
 * leaf node. A leaf is a node with no children.
 *
 * Example 1:
 *              5
 *             / \
 *            4   8
 *           /   / \
 *          11  13  4
 *         /  \    / \
 *        7    2  5   1
 *
 * Input: root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
 * Output: [[5,4,11,2],[5,8,4,5]]
 * Explanation: There are two paths whose sum equals 22:
 *   5 + 4 + 11 + 2 = 22
 *   5 + 8 + 4 + 5 = 22
 *
 * Example 2:
 *       1
 *      / \
 *     2   3
 *
 * Input: root = [1,2,3], targetSum = 5
 * Output: []
 *
 * Example 3:
 * Input: root = [1,2], targetSum = 0
 * Output: []
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 5000]
 * - -1000 <= Node.val <= 1000
 * - -1000 <= targetSum <= 1000
 *
 * Approach: DFS + Backtracking
 * Time Complexity: O(n^2) - visit each node, copy path at leaves
 * Space Complexity: O(n) - path array and recursion stack
 *
 * Related Problems:
 * - Path Sum I (LeetCode #112) - see pathSumI.js
 * - Path Sum III (LeetCode #437) - see pathSumIII.js
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
 * Finds all root-to-leaf paths where the sum equals targetSum
 * Uses DFS + Backtracking
 *
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 */
const pathSum = (root, targetSum) => {
  const res = [];

  /**
   * @param {TreeNode} node - current tree node
   * @param {number} remainingSum - how much sum is still needed
   * @param {number[]} path - current path from root
   */
  const dfs = (node, remainingSum, path) => {
    // 1. Base case: reached beyond leaf
    if (!node) return;

    // 2. Choose: include current node in path
    path.push(node.val);
    remainingSum -= node.val;

    // 3. Check: if leaf node and sum matches
    if (!node.left && !node.right && remainingSum === 0) {
      // Push a COPY, not reference (important for backtracking!)
      res.push([...path]);
    }

    // 4. Explore children
    dfs(node.left, remainingSum, path);
    dfs(node.right, remainingSum, path);

    // 5. Un-choose (backtrack) - remove current node from path
    path.pop();
  };

  dfs(root, targetSum, []);
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
//              5
//             / \
//            4   8
//           /   / \
//          11  13  4
//         /  \    / \
//        7    2  5   1
const tree1 = buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]);
console.log("Test 1:", JSON.stringify(pathSum(tree1, 22)));
// Expected: [[5,4,11,2],[5,8,4,5]]

// Test Case 2: No valid path
//       1
//      / \
//     2   3
const tree2 = buildTree([1, 2, 3]);
console.log("Test 2:", JSON.stringify(pathSum(tree2, 5)));
// Expected: []

// Test Case 3: Empty tree
console.log("Test 3:", JSON.stringify(pathSum(null, 0)));
// Expected: []

// Test Case 4: Single node matches
const tree4 = buildTree([5]);
console.log("Test 4:", JSON.stringify(pathSum(tree4, 5)));
// Expected: [[5]]

// Test Case 5: Single node doesn't match
console.log("Test 5:", JSON.stringify(pathSum(tree4, 1)));
// Expected: []

// Test Case 6: Negative values
//        -2
//          \
//          -3
const tree6 = buildTree([-2, null, -3]);
console.log("Test 6:", JSON.stringify(pathSum(tree6, -5)));
// Expected: [[-2,-3]]

// Test Case 7: Multiple valid paths
//           1
//         /   \
//        2     2
//       / \   / \
//      3   3 3   3
const tree7 = buildTree([1, 2, 2, 3, 3, 3, 3]);
console.log("Test 7:", JSON.stringify(pathSum(tree7, 6)));
// Expected: [[1,2,3],[1,2,3],[1,2,3],[1,2,3]]

// Test Case 8: Deeper tree with one valid path
//              5
//             / \
//            4   8
//           /   / \
//          11  13  4
//         /  \      \
//        7    2      1
const tree8 = buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]);
console.log("Test 8:", JSON.stringify(pathSum(tree8, 22)));
// Expected: [[5,4,11,2]]

// Test Case 9: Sum equals single root-to-leaf path
console.log("Test 9:", JSON.stringify(pathSum(tree8, 26)));
// Expected: [[5,8,13]] - path 5 → 8 → 13 = 26

console.log("Test 10:", JSON.stringify(pathSum(tree8, 18)));
// Expected: [[5,8,4,1]] - path 5 → 8 → 4 → 1 = 18
