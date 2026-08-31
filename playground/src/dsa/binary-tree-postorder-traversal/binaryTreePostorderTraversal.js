// ============================================================================
// APPROACH: DFS — Recursive, Then Reversed "Root-Right-Left"
// ============================================================================
/**
 * STORY / INTUITION:
 * Postorder visits a node only AFTER both its children, which makes it the
 * traversal for anything that must aggregate upward: computing height, deleting
 * a tree, Diameter of Binary Tree, Binary Tree Maximum Path Sum. A node cannot
 * answer until its children have.
 *
 * That "wait for both children" rule is what makes it the AWKWARD one to write
 * iteratively — on popping a node you cannot tell whether you are arriving at
 * it or returning to it.
 *
 * The clean trick: postorder is Left-Right-Node. Reverse it and you get
 * Node-Right-Left — which is just preorder with the push order flipped, and
 * preorder is trivial iteratively. So:
 *
 *   run preorder but push LEFT before RIGHT (giving Node-Right-Left),
 *   then reverse the result.
 *
 * DRY RUN: [1,null,2,3]  (1 with right child 2, whose left child is 3)
 *   Node-Right-Left pass: visit 1, visit 2, visit 3  → [1,2,3]
 *   reverse                                          → [3,2,1]
 *
 * Time:  O(N) — one pass plus one reverse
 * Space: O(N) for the output (O(H) for the stack)
 */

// Definition for a binary tree node
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Iterative — build Node-Right-Left, then reverse into Left-Right-Node. */
const postorderTraversal = (root) => {
  if (!root) return [];

  const result = [];
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val);

    // Mirror of preorder: push LEFT first so RIGHT comes off the stack next,
    // producing Node-Right-Left.
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }

  return result.reverse(); // Node-Right-Left reversed IS Left-Right-Node
};

/** Recursive — the definition, stated directly. */
const postorderRecursive = (root, out = []) => {
  if (!root) return out;
  postorderRecursive(root.left, out);
  postorderRecursive(root.right, out);
  out.push(root.val);
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
  `${JSON.stringify(postorderTraversal(buildTree(arr)))} (recursive: ${JSON.stringify(
    postorderRecursive(buildTree(arr)),
  )})`;

console.log("=== Binary Tree Postorder Traversal Tests ===\n");

console.log("Test 1:", show([1, null, 2, 3]));        // Expected: [3,2,1]
console.log("Test 2:", show([]));                      // Expected: []
console.log("Test 3:", show([1]));                     // Expected: [1]
console.log("Test 4:", show([4, 2, 6, 1, 3, 5, 7]));   // Expected: [1,3,2,5,7,6,4]
console.log("Test 5:", show([1, 2, null, 3]));         // Expected: [3,2,1] (left-degenerate)

module.exports = { postorderTraversal, postorderRecursive, TreeNode };
