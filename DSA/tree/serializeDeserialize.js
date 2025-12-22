/**
 * ============================================================================
 * PROBLEM: Serialize and Deserialize Binary Tree (LeetCode #297)
 * ============================================================================
 *
 * Serialization is the process of converting a data structure or object into
 * a sequence of bits so that it can be stored or transmitted. Design an
 * algorithm to serialize and deserialize a binary tree.
 *
 * The encoded string should be as compact as possible.
 *
 * Example 1:
 *         1
 *        / \
 *       2   3
 *          / \
 *         4   5
 *
 * Input: root = [1,2,3,null,null,4,5]
 * Output: [1,2,3,null,null,4,5]
 *
 * Example 2:
 * Input: root = []
 * Output: []
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 10^4]
 * - -1000 <= Node.val <= 1000
 *
 * Approach: Pre-order DFS traversal
 * - Serialize: Pre-order traversal, use "N" for null nodes
 * - Deserialize: Reconstruct using same pre-order pattern
 *
 * Time Complexity: O(n) for both operations
 * Space Complexity: O(n) - string storage and recursion stack
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
 * Encodes a tree to a single string.
 * @param {TreeNode} root
 * @return {string}
 */
const serialize = (root) => {
  const res = [];

  const dfs = (node) => {
    if (!node) {
      res.push("N"); // Mark null nodes
      return;
    }
    res.push(node.val); // Pre-order: process node first
    dfs(node.left); // Then left subtree
    dfs(node.right); // Then right subtree
  };

  dfs(root);
  return res.join(",");
};

/**
 * Decodes your encoded data to tree.
 * @param {string} data
 * @return {TreeNode}
 */
const deserialize = (data) => {
  const values = data.split(",");
  let i = 0;

  function dfs() {
    if (values[i] === "N") {
      i++;
      return null;
    }

    const node = new TreeNode(Number(values[i]));
    i++;
    node.left = dfs(); // Reconstruct left subtree
    node.right = dfs(); // Reconstruct right subtree
    return node;
  }

  return dfs();
};

// ============================================================================
// SAMPLE TEST CASES
// ============================================================================

// Helper function to build tree from array
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

// Helper to print tree for verification
function printTree(root) {
  if (!root) return "[]";
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }

  // Remove trailing nulls
  while (result[result.length - 1] === null) {
    result.pop();
  }

  return JSON.stringify(result);
}

// Test Case 1:
//         1
//        / \
//       2   3
//          / \
//         4   5
const tree1 = buildTree([1, 2, 3, null, null, 4, 5]);
const serialized1 = serialize(tree1);
console.log("Test 1 - Serialized:", serialized1);
// Expected: "1,2,N,N,3,4,N,N,5,N,N"

const deserialized1 = deserialize(serialized1);
console.log("Test 1 - Deserialized:", printTree(deserialized1));
// Expected: [1,2,3,null,null,4,5]

// Test Case 2: Empty tree
const tree2 = null;
const serialized2 = serialize(tree2);
console.log("Test 2 - Serialized:", serialized2);
// Expected: "N"

const deserialized2 = deserialize(serialized2);
console.log("Test 2 - Deserialized:", deserialized2);
// Expected: null

// Test Case 3: Single node
const tree3 = new TreeNode(42);
const serialized3 = serialize(tree3);
console.log("Test 3 - Serialized:", serialized3);
// Expected: "42,N,N"

const deserialized3 = deserialize(serialized3);
console.log("Test 3 - Deserialized:", printTree(deserialized3));
// Expected: [42]

// Test Case 4: Complete binary tree
//         1
//        / \
//       2   3
//      / \ / \
//     4  5 6  7
const tree4 = buildTree([1, 2, 3, 4, 5, 6, 7]);
const serialized4 = serialize(tree4);
console.log("Test 4 - Serialized:", serialized4);
// Expected: "1,2,4,N,N,5,N,N,3,6,N,N,7,N,N"

const deserialized4 = deserialize(serialized4);
console.log("Test 4 - Deserialized:", printTree(deserialized4));
// Expected: [1,2,3,4,5,6,7]

// Test Case 5: Left-skewed tree
//     1
//    /
//   2
//  /
// 3
const tree5 = buildTree([1, 2, null, 3]);
const serialized5 = serialize(tree5);
console.log("Test 5 - Serialized:", serialized5);
const deserialized5 = deserialize(serialized5);
console.log("Test 5 - Deserialized:", printTree(deserialized5));
// Expected: [1,2,null,3]
