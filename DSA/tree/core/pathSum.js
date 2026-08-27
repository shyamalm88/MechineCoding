/**
 * PROBLEM: Path Sum (LeetCode #112)
 *
 * Is there a root-to-LEAF path whose values sum to targetSum?
 *
 * INTUITION:
 * Subtract as you descend: ask each child whether it can make up the remainder.
 * The base case is what people get wrong — you must land on an actual LEAF
 * (no children), not merely reach null.
 *
 *   if (!root) return false        ← null is not a leaf
 *   if (leaf) return remaining === root.val
 *
 * Returning true at null would accept a single-child node whose one branch is
 * missing, which is not a root-to-leaf path.
 *
 * Negative values are allowed, so you cannot prune early when the remainder
 * goes below zero.
 *
 * TIME: O(n)   SPACE: O(h) recursion depth
 */
const TreeNode = function (val, left = null, right = null) { this.val = val; this.left = left; this.right = right; };

const hasPathSum = (root, targetSum) => {
  if (!root) return false;
  if (!root.left && !root.right) return targetSum === root.val; // leaf
  const remaining = targetSum - root.val;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
};

const t = new TreeNode(5,
  new TreeNode(4, new TreeNode(11, new TreeNode(7), new TreeNode(2))),
  new TreeNode(8, new TreeNode(13), new TreeNode(4, null, new TreeNode(1))));
console.log(hasPathSum(t, 22)); // true  5+4+11+2
console.log(hasPathSum(t, 26)); // true  5+8+13
console.log(hasPathSum(new TreeNode(1, new TreeNode(2)), 1)); // false -- 1 is not a leaf
console.log(hasPathSum(null, 0)); // false
