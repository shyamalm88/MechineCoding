// ============================================================================
// APPROACH: DFS — Recursive, Then an Explicit Stack (Push RIGHT Before LEFT)
// ============================================================================
/**
 * STORY / INTUITION:
 * Preorder visits a node BEFORE its children, which makes it the traversal for
 * COPYING or SERIALISING a tree: emit a node, then everything under it. That is
 * exactly why Serialize/Deserialize and Construct Tree from Preorder+Inorder
 * are built on it.
 *
 * It is also the easiest traversal to write iteratively, because the visit
 * happens the moment you pop — no "have I finished my children yet?" bookkeeping.
 *
 *   pop → visit → push RIGHT → push LEFT
 *
 * The push order is the whole trick and the usual bug. A stack is LIFO, so
 * whatever goes in last comes out first. Pushing right first means LEFT is on
 * top and gets processed next — which is what preorder demands. Push left first
 * and you get a mirrored traversal that looks almost right on a symmetric test
 * tree and fails on everything else.
 *
 * DRY RUN: [1,null,2,3]  (1 with right child 2, whose left child is 3)
 *   stack [1] → pop 1, visit 1. push right 2. (no left)      stack [2]
 *   pop 2, visit 2. no right. push left 3.                   stack [3]
 *   pop 3, visit 3. no children.                             stack []
 *   result [1,2,3]
 *
 * Time:  O(N)
 * Space: O(H) — the stack holds at most one root-to-leaf path plus siblings
 */

// Definition for a binary tree node
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Iterative — pop, visit, then push right BEFORE left. */
const preorderTraversal = (root) => {
  if (!root) return [];

  const result = [];
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val); // visit on pop — no deferred work in preorder

    // LIFO: pushing right first leaves left on top, so left is handled next.
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }

  return result;
};

/** Recursive — the shape the iterative version is emulating. */
const preorderRecursive = (root, out = []) => {
  if (!root) return out;
  out.push(root.val);
  preorderRecursive(root.left, out);
  preorderRecursive(root.right, out);
  return out;
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

const show = (arr) =>
  `${JSON.stringify(preorderTraversal(buildTree(arr)))} (recursive: ${JSON.stringify(
    preorderRecursive(buildTree(arr)),
  )})`;

console.log("=== Binary Tree Preorder Traversal Tests ===\n");

console.log("Test 1:", show([1, null, 2, 3]));        // Expected: [1,2,3]
console.log("Test 2:", show([]));                      // Expected: []
console.log("Test 3:", show([1]));                     // Expected: [1]
console.log("Test 4:", show([4, 2, 6, 1, 3, 5, 7]));   // Expected: [4,2,1,3,6,5,7]
console.log("Test 5:", show([1, 2, null, 3]));         // Expected: [1,2,3] (left-degenerate)

module.exports = { preorderTraversal, preorderRecursive, TreeNode };
