// ============================================================================
// APPROACH: DFS with Helper
// ============================================================================
/**
 * INTUITION:
 * We need to traverse the main `root` tree. For every node we visit, we treat
 * it as a potential candidate for the root of the `subRoot` tree.
 *
 * We use a helper function `isSameTree(p, q)` which checks if two trees are identical.
 *
 * Algorithm:
 * 1. If `subRoot` is null, it's technically a subtree of anything (or handle per constraints).
 * 2. If `root` is null, it cannot contain `subRoot` (unless subRoot is null).
 * 3. Check if the tree starting at `root` is identical to `subRoot`.
 * 4. If not, recursively check if `subRoot` is a subtree of `root.left` OR `root.right`.
 *
 * Time Complexity: O(M * N) - In worst case, for every node in root (N), we compare with subRoot (M).
 * Space Complexity: O(H) - Recursion stack.
 */
const isSubtree = (root, subRoot) => {
  if (!subRoot) return true; // Null is a subtree of everything
  if (!root) return false; // Main tree empty but subRoot isn't

  // Check if trees match at this exact node
  if (isSameTree(root, subRoot)) return true;

  // Otherwise, try left and right subtrees
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};

// Helper: Same Tree (LeetCode #100)
const isSameTree = (p, q) => {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;

  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};

// Definition for a binary tree node
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Subtree Tests ===\n");

// Case 1: Match
//     3
//    / \
//   4   5
//  / \
// 1   2
const root1 = new TreeNode(
  3,
  new TreeNode(4, new TreeNode(1), new TreeNode(2)),
  new TreeNode(5)
);
const sub1 = new TreeNode(4, new TreeNode(1), new TreeNode(2));
console.log("Test 1:", isSubtree(root1, sub1)); // Expected: true

// Case 2: No Match (extra node 0)
//     3
//    / \
//   4   5
//  / \
// 1   2
//    /
//   0
const root2 = new TreeNode(
  3,
  new TreeNode(4, new TreeNode(1), new TreeNode(2, new TreeNode(0))),
  new TreeNode(5)
);
console.log("Test 2:", isSubtree(root2, sub1)); // Expected: false

module.exports = { isSubtree };
