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
