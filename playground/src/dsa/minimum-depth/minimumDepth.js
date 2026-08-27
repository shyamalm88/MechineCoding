const TreeNode = function (val, left = null, right = null) { this.val = val; this.left = left; this.right = right; };

const minDepthBFS = (root) => {
  if (!root) return 0;
  let queue = [root];
  let depth = 1;
  while (queue.length) {
    const next = [];
    for (const node of queue) {
      if (!node.left && !node.right) return depth; // first leaf wins
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
    depth++;
  }
  return depth;
};

const minDepthDFS = (root) => {
  if (!root) return 0;
  if (!root.left) return 1 + minDepthDFS(root.right);  // one-child guard
  if (!root.right) return 1 + minDepthDFS(root.left);
  return 1 + Math.min(minDepthDFS(root.left), minDepthDFS(root.right));
};

const t = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
console.log(minDepthBFS(t), minDepthDFS(t)); // 2 2
const skew = new TreeNode(2, null, new TreeNode(3, null, new TreeNode(4)));
console.log(minDepthBFS(skew), minDepthDFS(skew)); // 3 3 -- not 1
