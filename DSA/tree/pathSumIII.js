/**
 * ============================================================================
 * PROBLEM: Path Sum III (LeetCode #437)
 * ============================================================================
 *
 * Given the root of a binary tree and an integer targetSum, return the
 * number of paths where the sum of the values along the path equals
 * targetSum.
 *
 * The path does not need to start or end at the root or a leaf, but it
 * must go downwards (i.e., traveling only from parent nodes to child nodes).
 *
 * Example 1:
 *              10
 *             /  \
 *            5   -3
 *           / \    \
 *          3   2    11
 *         / \   \
 *        3  -2   1
 *
 * Input: root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
 * Output: 3
 * Explanation: The paths that sum to 8 are:
 *   1. 5 → 3
 *   2. 5 → 2 → 1
 *   3. -3 → 11
 *
 * Example 2:
 * Input: root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
 * Output: 3
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 1000]
 * - -10^9 <= Node.val <= 10^9
 * - -1000 <= targetSum <= 1000
 *
 * Approach 1: Brute Force - O(n²)
 * Approach 2: Prefix Sum with HashMap - O(n)
 *
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

// ============================================================================
// SOLUTION 1: Brute Force - O(n²)
// ============================================================================

/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
const pathSumIII = (root, targetSum) => {
  let count = 0;

  // Count paths starting from this node going downward
  const countPaths = (node, remaining) => {
    if (!node) return;

    // If current path sums to target, increment count
    if (node.val === remaining) {
      count++;
    }

    // Continue exploring (even after finding a match, there might be more)
    // e.g., [1, -1, 1] with target 1 has multiple valid paths
    countPaths(node.left, remaining - node.val);
    countPaths(node.right, remaining - node.val);
  };

  // Try starting from every node in the tree
  const traverse = (node) => {
    if (!node) return;

    countPaths(node, targetSum); // Count paths starting from this node
    traverse(node.left); // Try starting from left subtree
    traverse(node.right); // Try starting from right subtree
  };

  traverse(root);
  return count;
};

// ============================================================================
// SOLUTION 2: Prefix Sum with HashMap - O(n)
// ============================================================================

/**
 * Key insight: If prefixSum at node X minus prefixSum at ancestor Y equals
 * targetSum, then the path from Y to X sums to targetSum.
 *
 * currentSum - targetSum = previousPrefixSum
 * means there exists a path ending at current node with sum = targetSum
 */
const pathSumIIIOptimized = (root, targetSum) => {
  let count = 0;
  const prefixSumCount = new Map();
  prefixSumCount.set(0, 1); // Empty path has sum 0

  const dfs = (node, currentSum) => {
    if (!node) return;

    // Add current node to running sum
    currentSum += node.val;

    // Check if there's a prefix that, when subtracted, gives targetSum
    // currentSum - prefixSum = targetSum
    // prefixSum = currentSum - targetSum
    const neededPrefix = currentSum - targetSum;
    if (prefixSumCount.has(neededPrefix)) {
      count += prefixSumCount.get(neededPrefix);
    }

    // Add current sum to the map
    prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0) + 1);

    // Recurse to children
    dfs(node.left, currentSum);
    dfs(node.right, currentSum);

    // Backtrack: remove current sum from the map
    // (so it doesn't affect other branches)
    prefixSumCount.set(currentSum, prefixSumCount.get(currentSum) - 1);
  };

  dfs(root, 0);
  return count;
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
//              10
//             /  \
//            5   -3
//           / \    \
//          3   2    11
//         / \   \
//        3  -2   1
const tree1 = buildTree([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]);
console.log("Test 1:", pathSumIII(tree1, 8));
// Expected: 3 (paths: [5,3], [5,2,1], [-3,11])

// Test Case 2:
//              5
//             / \
//            4   8
//           /   / \
//          11  13  4
//         /  \    / \
//        7    2  5   1
const tree2 = buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]);
console.log("Test 2:", pathSumIII(tree2, 22));
// Expected: 3

// Test Case 3: Empty tree
console.log("Test 3:", pathSumIII(null, 8));
// Expected: 0

// Test Case 4: Single node matches
const tree4 = buildTree([8]);
console.log("Test 4:", pathSumIII(tree4, 8));
// Expected: 1

// Test Case 5: Single node doesn't match
console.log("Test 5:", pathSumIII(tree4, 5));
// Expected: 0

// Test Case 6: Path can be single node
//       1
//      / \
//     2   3
const tree6 = buildTree([1, 2, 3]);
console.log("Test 6:", pathSumIII(tree6, 3));
// Expected: 2 (paths: [1,2] and [3])

// Test Case 7: Negative values creating multiple paths
//       0
//      / \
//     1  -1
const tree7 = buildTree([0, 1, -1]);
console.log("Test 7:", pathSumIII(tree7, 0));
// Expected: 3 (paths: [0], [0,1,-1]... wait that's not valid downward)
// Actually: [0] at root, [1,-1]? No, must be continuous downward
// Paths: [0], and... let me reconsider
// Expected: 1 (just [0])

// Test with optimized solution
console.log("\n--- Optimized O(n) Solution ---");
console.log("Test 1 (Optimized):", pathSumIIIOptimized(tree1, 8));
// Expected: 3

console.log("Test 2 (Optimized):", pathSumIIIOptimized(tree2, 22));
// Expected: 3

console.log("Test 6 (Optimized):", pathSumIIIOptimized(tree6, 3));
// Expected: 2

// Test Case 8: All same values
//       1
//      / \
//     1   1
//    / \
//   1   1
const tree8 = buildTree([1, 1, 1, 1, 1]);
console.log("Test 8:", pathSumIII(tree8, 2));
// Expected: 4 (each parent-child pair sums to 2)

console.log("Test 8 (Optimized):", pathSumIIIOptimized(tree8, 2));
// Expected: 4
