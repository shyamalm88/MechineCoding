/**
 * ============================================================================
 * PROBLEM: Construct Binary Tree from Preorder and Inorder Traversal (LeetCode #105)
 * ============================================================================
 * Given two integer arrays preorder and inorder where preorder is the preorder
 * traversal of a binary tree and inorder is the inorder traversal of the same tree,
 * construct and return the binary tree.
 *
 * Example 1:
 * Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * Output: [3,9,20,null,null,15,7]
 *
 * Constraints:
 * - 1 <= preorder.length <= 3000
 * - inorder.length == preorder.length
 * - preorder and inorder consist of unique values.
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
// APPROACH: Recursion with HashMap Optimization
// ============================================================================
/**
 * INTUITION:
 * 1. Preorder is [Root, ...Left, ...Right]. The first element is ALWAYS the root.
 * 2. Inorder is [...Left, Root, ...Right].
 * 3. Once we know the Root value from Preorder, we can find it in Inorder.
 *    Everything to the left of Root in Inorder belongs to the Left Subtree.
 *    Everything to the right belongs to the Right Subtree.
 *
 * OPTIMIZATION:
 * Instead of using `indexOf` (O(N)) and `slice` (O(N)) in every recursive step
 * (which makes it O(N^2)), we:
 * 1. Build a HashMap of { value: index } for Inorder traversal for O(1) lookup.
 * 2. Pass pointers (start, end) instead of slicing arrays.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
const buildTree = (preorder, inorder) => {
  const inMap = new Map();
  // 1. Build a hashmap for O(1) lookup of values in the inorder array
  for (let i = 0; i < inorder.length; i++) {
    inMap.set(inorder[i], i);
  }

  let preIdx = 0; // Tracks our progress in the preorder array

  const build = (inStart, inEnd) => {
    // Base case: If start index exceeds end index, this subtree is empty
    if (inStart > inEnd) return null;

    // 2. Pick the current root value from preorder traversal
    const rootVal = preorder[preIdx++];
    const root = new TreeNode(rootVal);

    // 3. Find the index of this root in the inorder array to split left/right subtrees
    const inIdx = inMap.get(rootVal);

    // 4. Recursively build left and right subtrees
    // Left subtree: elements from inStart to inIdx - 1
    root.left = build(inStart, inIdx - 1);
    // Right subtree: elements from inIdx + 1 to inEnd
    root.right = build(inIdx + 1, inEnd);

    return root;
  };

  return build(0, inorder.length - 1);
};

console.log("=== Construct Tree Tests ===\n");
const tree = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
console.log("Test 1 Root:", tree.val); // Expected: 3
console.log("Test 1 Left:", tree.left.val); // Expected: 9
console.log("Test 1 Right:", tree.right.val); // Expected: 20

module.exports = { buildTree };
