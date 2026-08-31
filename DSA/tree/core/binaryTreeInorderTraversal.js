/**
 * ============================================================================
 * PROBLEM: Binary Tree Inorder Traversal (LeetCode #94)
 * CATEGORY: 🔵 CORE (DFS / Tree Traversal)
 * ============================================================================
 *
 * Given the root of a binary tree, return the inorder traversal of its nodes'
 * values — LEFT subtree, then NODE, then RIGHT subtree.
 *
 * Example 1:
 * Input: root = [1,null,2,3] → Output: [1,3,2]
 *
 * Example 2:
 * Input: root = [] → Output: []
 *
 * Example 3:
 * Input: root = [4,2,6,1,3,5,7] → Output: [1,2,3,4,5,6,7]
 *
 * Constraints:
 * - The number of nodes is in the range [0, 100]
 * - -100 <= Node.val <= 100
 *
 * FOLLOW-UP (the part interviews actually care about): solve it iteratively.
 */

// ============================================================================
// APPROACH: DFS — Recursive, Then the Explicit-Stack Version
// ============================================================================
/**
 * STORY / INTUITION:
 * Inorder is the traversal that prints a BST in sorted order, which is why it
 * shows up constantly (Validate BST, Kth Smallest in a BST both lean on it).
 *
 * Recursion is three lines, but recursion IS a stack — the call stack. The
 * iterative version just makes that stack explicit, and interviewers ask for
 * it because it proves you understand what recursion was doing for you.
 *
 * The iterative shape:
 *   1. Walk left as far as you can, pushing every node you pass.
 *   2. Pop. That node has no unvisited left subtree, so VISIT it now.
 *   3. Move right and repeat.
 *
 * The outer loop condition is `node || stack.length` — not just the stack.
 * After popping a node and stepping right, the stack can be momentarily empty
 * while `node` still points at real work. Testing only the stack truncates the
 * traversal, which is the classic bug here.
 *
 * DRY RUN: [1,null,2,3]  (1 with right child 2, whose left child is 3)
 *   node=1: push 1, node=null (no left)
 *   pop 1 → visit 1. node = 1.right = 2
 *   node=2: push 2, go left → node=3; push 3, node=null
 *   pop 3 → visit 3. node = null
 *   pop 2 → visit 2. node = null. stack empty → done
 *   result [1,3,2]
 *
 * Time:  O(N) — every node pushed and popped once
 * Space: O(H) where H is the tree height (O(N) for a degenerate tree)
 */

// Definition for a binary tree node
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Iterative — the version to reach for when asked "without recursion". */
const inorderTraversal = (root) => {
  const result = [];
  const stack = [];
  let node = root;

  // `node ||` matters: the stack empties while work still remains.
  while (node || stack.length > 0) {
    // Descend left, remembering the path back.
    while (node) {
      stack.push(node);
      node = node.left;
    }

    node = stack.pop();
    result.push(node.val); // left subtree done → this node is next in order
    node = node.right;
  }

  return result;
};

/** Recursive — same order, shorter, uses the call stack instead. */
const inorderRecursive = (root, out = []) => {
  if (!root) return out;
  inorderRecursive(root.left, out);
  out.push(root.val);
  inorderRecursive(root.right, out);
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

const show = (arr) => {
  const tree = buildTree(arr);
  return `${JSON.stringify(inorderTraversal(tree))} (recursive: ${JSON.stringify(
    inorderRecursive(buildTree(arr)),
  )})`;
};

console.log("=== Binary Tree Inorder Traversal Tests ===\n");

console.log("Test 1:", show([1, null, 2, 3]));        // Expected: [1,3,2]
console.log("Test 2:", show([]));                      // Expected: []
console.log("Test 3:", show([1]));                     // Expected: [1]
console.log("Test 4:", show([4, 2, 6, 1, 3, 5, 7]));   // Expected: [1,2,3,4,5,6,7]
console.log("Test 5:", show([1, 2, null, 3]));         // Expected: [3,2,1] (left-degenerate)

module.exports = { inorderTraversal, inorderRecursive, TreeNode };
